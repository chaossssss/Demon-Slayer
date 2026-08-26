"""Key black→alpha for pierce/whirl/heavy/impact/mana → public/vfx/<tag>/01..08.png"""
from PIL import Image
from pathlib import Path

ASSETS = Path(r"C:\Users\20220921\.cursor\projects\e-work-DemonSlayer\assets")
OUT = Path(r"E:\work\DemonSlayer\public\vfx")

SETS = {
    "pierce": [f"pierce-f{i:02d}.png" for i in range(1, 9)],
    "whirl": [f"whirl-f{i:02d}.png" for i in range(1, 9)],
    "heavy": [f"heavy-f{i:02d}.png" for i in range(1, 9)],
    "impact": [f"impact-f{i:02d}.png" for i in range(1, 9)],
    "mana": [f"mana-f{i:02d}.png" for i in range(1, 9)],
}


def key_cool(im: Image.Image, thr=28) -> Image.Image:
    """White / steel-cyan blade glow."""
    im = im.convert("RGBA").resize((512, 512), Image.Resampling.LANCZOS)
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) / 3.0
            cool = b >= r - 8 and (g + b) > r + 18
            hot_white = lum > 165 and abs(r - g) < 45 and abs(g - b) < 45
            if lum <= thr:
                px[x, y] = (r, g, b, 0)
            elif not cool and not hot_white and lum < 135:
                px[x, y] = (r, g, b, 0)
            elif lum < thr + 45:
                fade = int(255 * (lum - thr) / 45)
                px[x, y] = (r, g, b, min(a, fade))
    return im


def key_gold(im: Image.Image, thr=26) -> Image.Image:
    """Gold / amber impact shockwave."""
    im = im.convert("RGBA").resize((512, 512), Image.Resampling.LANCZOS)
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) / 3.0
            gold = r >= 50 and g >= 35 and r >= b + 10 and (r + g) > b * 1.5
            hot_white = lum > 175 and r > 160 and g > 140
            if lum <= thr:
                px[x, y] = (r, g, b, 0)
            elif not gold and not hot_white:
                px[x, y] = (r, g, b, 0)
            elif lum < thr + 40:
                fade = int(255 * (lum - thr) / 40)
                px[x, y] = (r, g, b, min(a, fade))
    return im


def key_mana(im: Image.Image, thr=26) -> Image.Image:
    """Cyan / blue spirit mana."""
    im = im.convert("RGBA").resize((512, 512), Image.Resampling.LANCZOS)
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) / 3.0
            cyan = b >= 45 and (g + b) > r * 1.45 and b >= r - 5
            hot_white = lum > 180 and abs(r - g) < 40 and abs(g - b) < 40
            if lum <= thr:
                px[x, y] = (r, g, b, 0)
            elif not cyan and not hot_white:
                px[x, y] = (r, g, b, 0)
            elif lum < thr + 40:
                fade = int(255 * (lum - thr) / 40)
                px[x, y] = (r, g, b, min(a, fade))
    return im


KEYERS = {
    "pierce": key_cool,
    "whirl": key_cool,
    "heavy": key_cool,
    "impact": key_gold,
    "mana": key_mana,
}

for tag, names in SETS.items():
    dest = OUT / tag
    dest.mkdir(parents=True, exist_ok=True)
    keyer = KEYERS[tag]
    frames = []
    for i, name in enumerate(names):
        src = ASSETS / name
        if not src.exists():
            raise SystemExit(f"missing {src}")
        keyed = keyer(Image.open(src))
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
