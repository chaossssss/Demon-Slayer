"""Process actor idle sprites: black→alpha, trim, normalize height → public/assets/actors/<kind>/idle.png"""
from PIL import Image
from pathlib import Path

ASSETS = Path(r"C:\Users\20220921\.cursor\projects\e-work-DemonSlayer\assets")
OUT = Path(r"E:\work\DemonSlayer\public\assets\actors")

KINDS = [
    "swordsman",
    "mage",
    "assassin",
    "guardian",
    "imp",
    "hound",
    "brute",
    "shaman",
    "elite",
    "boss",
]

TARGET_H = 128
PAD = 6


def key_black(im: Image.Image, thr=24) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) / 3.0
            if lum <= thr:
                px[x, y] = (r, g, b, 0)
            elif lum < thr + 36:
                fade = int(255 * (lum - thr) / 36)
                px[x, y] = (r, g, b, min(a, fade))
    return im


def trim_alpha(im: Image.Image) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    return im.crop(bbox)


def fit_height(im: Image.Image, target_h: int) -> Image.Image:
    w, h = im.size
    if h <= 0:
        return im
    scale = target_h / h
    nw = max(1, int(round(w * scale)))
    nh = max(1, int(round(h * scale)))
    return im.resize((nw, nh), Image.Resampling.NEAREST)


def pad_canvas(im: Image.Image, pad: int) -> Image.Image:
    w, h = im.size
    canvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    canvas.paste(im, (pad, pad), im)
    return canvas


for kind in KINDS:
    src = ASSETS / f"actor-{kind}.png"
    if not src.exists():
        print(f"skip missing {src}")
        continue
    raw = Image.open(src)
    keyed = key_black(raw)
    trimmed = trim_alpha(keyed)
    sized = fit_height(trimmed, TARGET_H)
    final = pad_canvas(sized, PAD)
    dest = OUT / kind
    dest.mkdir(parents=True, exist_ok=True)
    out = dest / "idle.png"
    final.save(out, "PNG")
    print(f"wrote {out} ({final.size[0]}x{final.size[1]})")

print("done")
