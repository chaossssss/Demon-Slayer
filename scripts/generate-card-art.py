"""Sequentially generate card art via OneRouter Image 2."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROMPTS = ROOT / "scripts" / "card-art-prompts.json"
OUT_DIR = ROOT / "public" / "assets" / "cards"
SKILL = Path(r"C:\Users\20220921\.claude\skills\onerouter-image-generation\scripts\onerouter-image-generation.py")


def build_prompt(data: dict, card: dict) -> str:
    parts = [data["prefix"]]
    cls = card.get("class")
    if cls and cls in data.get("identity", {}):
        parts.append(data["identity"][cls])
    parts.append(card["prompt"])
    parts.append("负面避免：" + data["negative"])
    return "".join(p if p.endswith("。") else p + "。" for p in parts)


def run_one(card: dict, data: dict) -> None:
    final = OUT_DIR / f"{card['id']}.png"
    out = OUT_DIR / f"{card['id']}.gen.png"
    if out.exists():
        out.unlink()
    prompt = build_prompt(data, card)
    cmd = [
        sys.executable,
        str(SKILL),
        "edit" if card.get("ref") else "generate",
        "--provider",
        "image2",
        "--prompt",
        prompt,
        "--size",
        "768x1024",
        "--quality",
        "medium",
        "--timeout-seconds",
        "300",
        "--out",
        str(out),
    ]
    if card.get("ref"):
        cmd.extend(["--image", str(ROOT / card["ref"])])
    print(f"[card-art] {card['id']} ...", flush=True)
    result = subprocess.run(cmd, cwd=str(ROOT), check=False)
    if result.returncode != 0:
        raise SystemExit(result.returncode)
    if not out.exists():
        raise SystemExit(f"missing output: {out}")
    if final.exists():
        final.unlink()
    out.replace(final)
    print(f"[card-art] wrote {final}", flush=True)


def main() -> int:
    only = set(sys.argv[1:]) if len(sys.argv) > 1 else None
    data = json.loads(PROMPTS.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for card in data["cards"]:
        if only and card["id"] not in only:
            continue
        run_one(card, data)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
