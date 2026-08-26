"""Process smoke escape VFX: keep grey/purple wisps, key black → public/vfx/smoke/01..08.png"""
from PIL import Image
from pathlib import Path

ASSETS = Path(r"C:\Users\20220921\.cursor\projects\e-work-DemonSlayer\assets")
OUT = Path(r"E:\work\DemonSlayer\public\vfx\smoke")

NAMES = [f"smoke-f{i:02d}.png" for i in range(1, 9)]


def key_smoke(im: Image.Image, thr=22) -> Image.Image:
    im = im.convert("RGBA").resize((512, 512), Image.Resampling.LANCZOS)
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) / 3.0
            # grey smoke, white puff, faint purple assassin tint
            neutral = abs(r - g) < 38 and abs(g - b) < 38 and lum > thr + 8
            purple = b >= r - 6 and (r + b) > g * 1.15 and lum > thr + 10
            hot_white = lum > 175 and abs(r - g) < 35
            if lum <= thr:
                px[x, y] = (r, g, b, 0)
            elif not neutral and not purple and not hot_white:
                px[x, y] = (r, g, b, 0)
            elif lum < thr + 42:
                fade = int(255 * (lum - thr) / 42)
                px[x, y] = (r, g, b, min(a, fade))
    return im


OUT.mkdir(parents=True, exist_ok=True)
frames = []
for i, name in enumerate(NAMES):
    src = ASSETS / name
    if not src.exists():
        raise SystemExit(f"missing {src}")
    keyed = key_smoke(Image.open(src))
    out = OUT / f"{i + 1:02d}.png"
    keyed.save(out, "PNG")
    frames.append(keyed)
    print(f"wrote {out}")

strip = Image.new("RGBA", (512 * 8, 512), (0, 0, 0, 0))
for i, fr in enumerate(frames):
    strip.paste(fr, (i * 512, 0), fr)
strip.save(OUT / "preview-strip.png")
print("preview smoke")

# smoke-ult from processed base frames
import importlib.util

_ult_spec = importlib.util.spec_from_file_location(
    "process_ult_vfx", Path(__file__).with_name("process_ult_vfx.py")
)
_ult = importlib.util.module_from_spec(_ult_spec)
_ult_spec.loader.exec_module(_ult)

ULT = Path(r"E:\work\DemonSlayer\public\vfx\smoke-ult")
ULT.mkdir(parents=True, exist_ok=True)
ult_frames = []
for i in range(1, 9):
    fr = _ult.enhance_frame(Image.open(OUT / f"{i:02d}.png"), "smoke")
    fr.save(ULT / f"{i:02d}.png")
    ult_frames.append(fr)
    print(f"wrote {ULT / f'{i:02d}.png'}")
ult_strip = Image.new("RGBA", (512 * 8, 512), (0, 0, 0, 0))
for i, fr in enumerate(ult_frames):
    ult_strip.paste(fr, (i * 512, 0), fr)
ult_strip.save(ULT / "preview-strip.png")
print("preview smoke-ult")
print("done")
