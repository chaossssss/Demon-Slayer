# Godot 4 战斗特效（接到斩鬼录网页）

网页版 Vue **跑不了 Godot 运行时**。流程是：在 Godot 里把粒子做好 → 导出透明/绿幕片子 → 叠到 `/arena` 角色槽上。

需要 **Godot 4.3+**（你用的 4.7 也可以）。用编辑器打开本目录 `godot-vfx/`。

> **当前风格：A 冷利刀光**（白 / 青钢 / 极细刃线，鬼灭·只狼感）。符箓墨迹已拿掉。

> **4.7 注意**：若项目开启了「把警告当错误」，脚本里 `:=` 推断成 `Variant` 会直接报错。本仓库已按 4.7 修好；若你自己加脚本，请写明确类型，例如 `var a: float = lerpf(0.0, 1.0, t)`。

## 预览

运行主场景后：

| 键 | 作用 |
| --- | --- |
| `1` ~ `5` | 斩击 / 业火 / 治疗 / 护盾 / 烟雾 |
| `空格` | 重播当前 |
| `U` | 大招放大 |
| `G` | 绿幕 / 游戏暗底 |
| `R` | 导出 PNG 序列到 `export/<特效名>/` |

在编辑器里点开 `vfx/slash.tscn` 等，选中 `GPUParticles2D`，右侧调：数量、速度、颜色、寿命。这是出效果的地方。

## 导出成网页能播的片

先按 `G` 开绿幕，再按 `R`。然后（需本机有 ffmpeg）：

```bash
ffmpeg -y -framerate 30 -i godot-vfx/export/slash/%03d.png -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 public/vfx/slash.webm
```

`fire` / `heal` / `shield` / `smoke` 同样各导一条。三星大招在 Godot 里开 `U` 再导一份，存成 `slash-ult.webm`。

接到游戏：把 webm 放到 `public/vfx/`，出牌时播对应标签，不要一张牌一条片。现有 `SkillClip` 已会扣绿幕。

## 为什么比网页 Canvas 好看

Godot 的 `GPUParticles2D` 有拖尾、颜色/缩放曲线、环形发射、径向速度。网页那套是自己算粒子，同样密度更容易发糊、发假。
