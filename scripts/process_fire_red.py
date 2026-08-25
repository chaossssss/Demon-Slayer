"""Process red fire VFX frames: keep warm glow, strip black + dark silhouettes."""
from PIL import Image
from pathlib import Path

ASSETS = Path(r"C:\Users\20220921\.cursor\projects\e-work-DemonSlayer\assets")
DEST = Path(r"E:\work\DemonSlayer\public\vfx\fire")
DEST.mkdir(parents=True, exist_ok=True)

NAMES = [
    "fire-red-f01.png",
    "fire-red-f02.png",
    "fire-red-f03.png",
    "fire-red-f04.png",
    "fire-red-f05.png",
    "fire-red-f06.png",
    "fire-red-f07.png",
    "fire-red-f08.png",
]


def key_fire(im: Image.Image, thr=26) -> Image.Image:
    im = im.convert("RGBA").resize((512, 512), Image.Resampling.LANCZOS)
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) / 3.0
            # warm fire: red/orange/yellow dominant
            warm = r >= b + 8 and r >= 40 and (r + g) > b * 1.6
            hot_white = lum > 175 and r > 160 and g > 140
            if lum <= thr:
                px[x, y] = (r, g, b, 0)
            elif not warm and not hot_white:
                px[x, y] = (r, g, b, 0)
            elif lum < thr + 40:
                fade = int(255 * (lum - thr) / 40)
                px[x, y] = (r, g, b, min(a, fade))
    return im


frames = []
for i, name in enumerate(NAMES):
    keyed = key_fire(Image.open(ASSETS / name))
    out = DEST / f"{i + 1:02d}.png"
    keyed.save(out, "PNG")
    frames.append(keyed)
    print("wrote", out)

strip = Image.new("RGBA", (512 * 8, 512), (0, 0, 0, 0))
for i, fr in enumerate(frames):
    strip.paste(fr, (i * 512, 0), fr)
strip.save(DEST / "preview-strip.png")
print("done")
