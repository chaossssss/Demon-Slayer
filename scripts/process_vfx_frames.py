"""Key black→alpha for VFX frame sequences and write public/vfx/<tag>/01..08.png"""
from PIL import Image, ImageEnhance
from pathlib import Path

ASSETS = Path(r"C:\Users\20220921\.cursor\projects\e-work-DemonSlayer\assets")
OUT = Path(r"E:\work\DemonSlayer\public\vfx")

SETS = {
    "fire": [
        "fire-f01.png",
        "fire-f02.png",
        "fire-f03.png",
        "fire-f04.png",
        "fire-f05.png",
        "fire-f06.png",
        "fire-f07.png",
        "fire-f08.png",
    ],
    "heal": [
        "heal-f01.png",
        "heal-f02.png",
        "heal-f03.png",
        "heal-f04.png",
        "heal-f05.png",
        "heal-f06.png",
        "heal-f07.png",
        "heal-f08.png",
    ],
    "smoke": [
        "smoke-f01.png",
        "smoke-f02.png",
        "smoke-f03.png",
        "smoke-f04.png",
        "smoke-f05.png",
        "smoke-f06.png",
        "smoke-f07.png",
        "smoke-f08.png",
    ],
    "shield": [
        "shield-f01b.png",
        "shield-f02b.png",
        "shield-f03b.png",
        "shield-f04b.png",
        None,  # derived from peak
        "shield-f06b.png",
        "shield-f07b.png",
        "shield-f08b.png",
    ],
}


def key_black(im: Image.Image, thr=30) -> Image.Image:
    im = im.convert("RGBA").resize((512, 512), Image.Resampling.LANCZOS)
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) / 3
            # keep only luminous cool-glow pixels; drop dark silhouettes
            cool = b >= r - 8 and (g + b) > r + 20
            hot_white = lum > 170 and abs(r - g) < 40 and abs(g - b) < 40
            if lum <= thr:
                px[x, y] = (r, g, b, 0)
            elif not cool and not hot_white and lum < 140:
                px[x, y] = (r, g, b, 0)
            elif lum < thr + 45:
                fade = int(255 * (lum - thr) / 45)
                px[x, y] = (r, g, b, min(a, fade))
    return im


def derive_mid(peak: Image.Image, strength=0.72) -> Image.Image:
    im = peak.copy()
    im = ImageEnhance.Brightness(im).enhance(strength)
    im = ImageEnhance.Contrast(im).enhance(0.9)
    return im


for tag, names in SETS.items():
    dest = OUT / tag
    dest.mkdir(parents=True, exist_ok=True)
    peak = None
    frames = []
    for i, name in enumerate(names):
        if name is None:
            assert peak is not None
            keyed = key_black(derive_mid(peak, 0.78))
        else:
            src = ASSETS / name
            raw = Image.open(src)
            if i == 3:
                peak = raw.copy()
            keyed = key_black(raw)
        out = dest / f"{i + 1:02d}.png"
        keyed.save(out, "PNG")
        frames.append(keyed)
        print(f"wrote {out}")

    strip = Image.new("RGBA", (512 * 8, 512), (0, 0, 0, 0))
    for i, fr in enumerate(frames):
        strip.paste(fr, (i * 512, 0), fr)
    strip.save(dest / "preview-strip.png")
    print(f"preview {tag}")

print("done")
