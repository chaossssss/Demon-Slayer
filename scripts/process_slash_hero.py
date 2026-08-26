"""Process slash-hero frames so character height matches swordsman idle."""
from pathlib import Path

import numpy as np
from PIL import Image

ASSETS = Path(r"C:\Users\20220921\.cursor\projects\e-work-DemonSlayer\assets")
OUT = Path(r"E:\work\DemonSlayer\public\vfx\slash-hero")
IDLE = Path(r"E:\work\DemonSlayer\public\assets\actors\swordsman\idle.png")
OUT.mkdir(parents=True, exist_ok=True)

NAMES = [f"slash-hero-f{i:02d}.png" for i in range(1, 9)]
# AI 帧身形偏壮时可略调小；先按 idle 身高 1:1
VISUAL_TUNE = 1.0


def key_black(im: Image.Image, thr: int = 22) -> Image.Image:
    a = np.array(im.convert("RGBA"))
    r, g, b = a[:, :, 0].astype(np.int16), a[:, :, 1].astype(np.int16), a[:, :, 2].astype(np.int16)
    lum = (r + g + b) / 3.0
    near = (np.abs(r - g) < 18) & (np.abs(g - b) < 18)
    out = a.copy()
    out[lum <= thr, 3] = 0
    fade = (lum > thr) & (lum < thr + 28) & near
    out[fade, 3] = np.minimum(out[fade, 3], ((lum[fade] - thr) / 28 * 255).astype(np.uint8))
    return Image.fromarray(out)


def opaque_bbox(im: Image.Image, thr: int = 12):
    a = np.array(im)
    ys, xs = np.where(a[:, :, 3] > thr)
    if len(xs) == 0:
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def body_bbox(im: Image.Image, thr: int = 20):
    """Character-ish pixels; drop cyan slash and pure white glow."""
    a = np.array(im.convert("RGBA"))
    r, g, b, al = (
        a[:, :, 0].astype(np.int16),
        a[:, :, 1].astype(np.int16),
        a[:, :, 2].astype(np.int16),
        a[:, :, 3],
    )
    slash = (b > 160) & (g > 130) & (r < 160) & (b >= r + 20)
    white = (r > 220) & (g > 220) & (b > 220)
    orange = (r > 140) & (g > 60) & (g < 180) & (b < 120) & (r > g) & (r > b)
    red = (r > 100) & (r > g + 20) & (r > b + 20)
    skin = (r > 150) & (g > 100) & (b > 80) & (r > b) & (np.abs(r - g) < 80)
    dark = (al > thr) & ((r + g + b) < 220) & ((r + g + b) > 40)
    steel = (al > thr) & (np.abs(r - g) < 25) & (np.abs(g - b) < 25) & (r > 80) & (r < 200)
    m = (al > thr) & (~slash) & (~white) & (orange | red | skin | dark | steel)
    ys, xs = np.where(m)
    if len(xs) < 80:
        return opaque_bbox(im, thr)
    # Ignore sparse outliers: keep central 98% mass on Y via percentiles
    y0, y1 = np.percentile(ys, [1, 99])
    x0, x1 = np.percentile(xs, [1, 99])
    return int(x0), int(y0), int(x1), int(y1)


idle = Image.open(IDLE).convert("RGBA")
idle_bb = opaque_bbox(idle)
assert idle_bb
idle_char_h = idle_bb[3] - idle_bb[1] + 1
idle_h = idle.size[1]
idle_bottom_pad = idle_h - idle_bb[3] - 1
target_h = idle_char_h * VISUAL_TUNE
print(f"idle {idle.size} char_h={idle_char_h} target_h={target_h:.1f}")

scaled = []
for name in NAMES:
    src = key_black(Image.open(ASSETS / name))
    full = opaque_bbox(src)
    body = body_bbox(src)
    assert full and body
    body_h = body[3] - body[1] + 1
    # include slash: crop full content, scale by body height
    cropped = src.crop((full[0], full[1], full[2] + 1, full[3] + 1))
    # body coords relative to crop
    rel_body_h = body_h
    scale = target_h / rel_body_h
    nw = max(1, int(round(cropped.size[0] * scale)))
    nh = max(1, int(round(cropped.size[1] * scale)))
    im = cropped.resize((nw, nh), Image.Resampling.LANCZOS)
    bb = opaque_bbox(im)
    cb = body_bbox(im) or bb
    scaled.append((im, bb, cb))
    print(f"  {name} body_h={body_h} -> {im.size} out_body={(cb[3]-cb[1]+1) if cb else None}")

widths = []
for im, bb, cb in scaled:
    if not bb or not cb:
        continue
    cx = (cb[0] + cb[2]) / 2
    widths.append((cx - bb[0], bb[2] - cx))
left_ext = int(np.ceil(max(w[0] for w in widths))) + 1
right_ext = int(np.ceil(max(w[1] for w in widths))) + 1
canvas_w = max(idle.size[0], left_ext + right_ext)
canvas_h = idle_h
print(f"canvas {canvas_w}x{canvas_h}")

frames = []
for im, bb, cb in scaled:
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    if not bb or not cb:
        frames.append(canvas)
        continue
    cx = (cb[0] + cb[2]) / 2.0
    feet = bb[3]
    paste_x = int(round(canvas_w / 2 - cx))
    paste_y = canvas_h - idle_bottom_pad - 1 - feet
    # allow overflow draw then crop to canvas via alpha_composite on a temp
    tmp = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    # Pillow paste clips automatically
    tmp.alpha_composite(im, (paste_x, paste_y))
    frames.append(tmp)

for i, fr in enumerate(frames):
    out = OUT / f"{i + 1:02d}.png"
    fr.save(out, "PNG")
    cb = body_bbox(fr)
    print(f"wrote {out.name} {fr.size} body_h={(cb[3]-cb[1]+1) if cb else None}")

strip = Image.new("RGBA", (canvas_w * 8, canvas_h), (0, 0, 0, 0))
for i, fr in enumerate(frames):
    strip.paste(fr, (i * canvas_w, 0), fr)
strip.save(OUT / "preview-strip.png")
print("done")
