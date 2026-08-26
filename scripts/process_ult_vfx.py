"""Derive *-ult sprite sets from base public/vfx frames (brighter / thicker / tinted)."""
from PIL import Image, ImageEnhance, ImageFilter
from pathlib import Path

ROOT = Path(r"E:\work\DemonSlayer\public\vfx")

# base_tag → (ult_tag, mode)
# mode: cold | fire | heal | shield | smoke
ULTS = [
    ("slash", "slash-ult", "cold"),
    ("fire", "fire-ult", "fire"),
    ("heal", "heal-ult", "heal"),
    ("shield", "shield-ult", "shield"),
    ("smoke", "smoke-ult", "smoke"),
    ("pierce", "pierce-ult", "cold"),
    ("whirl", "whirl-ult", "cold"),
    ("heavy", "heavy-ult", "cold"),
    ("impact", "impact-ult", "gold"),
    ("mana", "mana-ult", "mana"),
]


def tint(im: Image.Image, rgb, amount=0.28) -> Image.Image:
    im = im.convert("RGBA")
    overlay = Image.new("RGBA", im.size, (*rgb, 0))
    px = im.load()
    ox = overlay.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            tr, tg, tb = rgb
            nr = int(r * (1 - amount) + tr * amount)
            ng = int(g * (1 - amount) + tg * amount)
            nb = int(b * (1 - amount) + tb * amount)
            ox[x, y] = (nr, ng, nb, a)
    return overlay


def thicken(im: Image.Image) -> Image.Image:
    """Slight bloom + brightness for ultimate punch."""
    blurred = im.filter(ImageFilter.GaussianBlur(radius=2.2))
    base = ImageEnhance.Brightness(im).enhance(1.18)
    base = ImageEnhance.Contrast(base).enhance(1.12)
    out = Image.alpha_composite(blurred, base)
    return out


def enhance_frame(im: Image.Image, mode: str) -> Image.Image:
    im = im.convert("RGBA").resize((512, 512), Image.Resampling.LANCZOS)
    im = thicken(im)
    if mode == "cold":
        im = tint(im, (255, 236, 190), 0.22)
        im = ImageEnhance.Brightness(im).enhance(1.08)
    elif mode == "fire":
        im = tint(im, (255, 90, 30), 0.2)
        im = ImageEnhance.Color(im).enhance(1.25)
        im = ImageEnhance.Brightness(im).enhance(1.15)
    elif mode == "heal":
        im = tint(im, (160, 255, 200), 0.18)
        im = ImageEnhance.Brightness(im).enhance(1.12)
    elif mode == "shield":
        im = tint(im, (180, 220, 255), 0.2)
        im = ImageEnhance.Brightness(im).enhance(1.14)
    elif mode == "smoke":
        im = tint(im, (160, 120, 200), 0.18)
        im = ImageEnhance.Brightness(im).enhance(1.14)
    elif mode == "gold":
        im = tint(im, (255, 200, 80), 0.25)
        im = ImageEnhance.Brightness(im).enhance(1.16)
    elif mode == "mana":
        im = tint(im, (80, 180, 255), 0.22)
        im = ImageEnhance.Brightness(im).enhance(1.14)
    return im


def run_all():
    for base, ult, mode in ULTS:
        src_dir = ROOT / base
        dest = ROOT / ult
        if not src_dir.exists():
            print(f"skip missing base {base}")
            continue
        dest.mkdir(parents=True, exist_ok=True)
        frames = []
        for i in range(1, 9):
            src = src_dir / f"{i:02d}.png"
            if not src.exists():
                raise SystemExit(f"missing {src}")
            fr = enhance_frame(Image.open(src), mode)
            out = dest / f"{i:02d}.png"
            fr.save(out, "PNG")
            frames.append(fr)
            print(f"wrote {out}")

        strip = Image.new("RGBA", (512 * 8, 512), (0, 0, 0, 0))
        for i, fr in enumerate(frames):
            strip.paste(fr, (i * 512, 0), fr)
        strip.save(dest / "preview-strip.png")
        print(f"preview {ult}")

    print("done")


if __name__ == "__main__":
    run_all()
