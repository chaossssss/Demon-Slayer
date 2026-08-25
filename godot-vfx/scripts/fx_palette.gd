class_name FxPalette
extends RefCounted

## A 风格：冷利刀光（白 / 青钢 / 淡金刃心）
const STEEL := Color(0.72, 0.82, 0.92, 1.0)
const ICE := Color(0.85, 0.95, 1.0, 1.0)
const BLADE := Color(1.0, 1.0, 1.0, 1.0)
const EDGE := Color(0.55, 0.78, 0.95, 1.0)
const BLOOD := Color(0.55, 0.12, 0.14, 1.0)
const GOLD := Color(0.788, 0.635, 0.153, 1.0)
const GOLD_BRIGHT := Color(1.0, 0.93, 0.72, 1.0)
const EMBER := Color(0.769, 0.361, 0.149, 1.0)
const JADE := Color(0.24, 0.42, 0.31, 1.0)
const JADE_GLOW := Color(0.56, 0.77, 0.66, 1.0)
const AQUA := Color(0.557, 0.706, 0.788, 1.0)
const PURPLE := Color(0.28, 0.32, 0.42, 1.0)
const PAPER := Color(0.851, 0.796, 0.702, 1.0)
const INK := Color(0.11, 0.09, 0.07, 1.0)

static func make_glow_material() -> CanvasItemMaterial:
	var mat := CanvasItemMaterial.new()
	mat.blend_mode = CanvasItemMaterial.BLEND_MODE_ADD
	return mat


static func make_soft_orb(size: int = 128, inner: Color = ICE, outer: Color = Color(1, 1, 1, 0)) -> GradientTexture2D:
	var g := Gradient.new()
	g.offsets = PackedFloat32Array([0.0, 0.08, 0.35, 1.0])
	g.colors = PackedColorArray([Color.WHITE, inner, inner.lerp(outer, 0.55), outer])
	var tex := GradientTexture2D.new()
	tex.gradient = g
	tex.width = size
	tex.height = size
	tex.fill = GradientTexture2D.FILL_RADIAL
	tex.fill_from = Vector2(0.5, 0.5)
	tex.fill_to = Vector2(0.5, 0.0)
	return tex
