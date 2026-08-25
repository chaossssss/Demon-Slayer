from PIL import Image
from pathlib import Path

src = Path(r"C:\Users\20220921\.cursor\projects\e-work-DemonSlayer\assets")
dst = Path(r"E:\work\DemonSlayer\public\vfx\slash")
dst.mkdir(parents=True, exist_ok=True)

mapping = {
    1: "slash-f01.png",
    2: "slash-f02.png",
    3: "slash-f03.png",
    4: "slash-f04.png",
    5: "slash-f05b.png",
    6: "slash-f06.png",
    7: "slash-f07.png",
    8: "slash-f08.png",
}


def key_black(im: Image.Image, thr=28) -> Image.Image:
    im = im.convert("RGBA")
    im = im.resize((512, 512), Image.Resampling.LANCZOS)
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) / 3
            if lum <= thr:
                px[x, y] = (r, g, b, 0)
            elif lum < thr + 40:
                fade = int(255 * (lum - thr) / 40)
                px[x, y] = (r, g, b, min(a, fade))
    return im


for i, name in mapping.items():
    keyed = key_black(Image.open(src / name))
    out = dst / f"{i:02d}.png"
    keyed.save(out, "PNG")
    print(f"wrote {out}")

frames = [Image.open(dst / f"{i:02d}.png") for i in range(1, 9)]
strip = Image.new("RGBA", (512 * 8, 512), (0, 0, 0, 0))
for i, fr in enumerate(frames):
    strip.paste(fr, (i * 512, 0), fr)
strip.save(dst / "preview-strip.png")
print("done")
