class_name FxPalette
extends RefCounted

const INK := Color(0.11, 0.09, 0.07, 1.0)
const BLOOD := Color(0.608, 0.176, 0.118, 1.0)
const GOLD := Color(0.788, 0.635, 0.153, 1.0)
const GOLD_BRIGHT := Color(1.0, 0.93, 0.72, 1.0)
const EMBER := Color(0.769, 0.361, 0.149, 1.0)
const JADE := Color(0.24, 0.42, 0.31, 1.0)
const JADE_GLOW := Color(0.56, 0.77, 0.66, 1.0)
const AQUA := Color(0.557, 0.706, 0.788, 1.0)
const PURPLE := Color(0.353, 0.239, 0.337, 1.0)
const PAPER := Color(0.851, 0.796, 0.702, 1.0)

static func make_glow_material() -> CanvasItemMaterial:
	var mat := CanvasItemMaterial.new()
	mat.blend_mode = CanvasItemMaterial.BLEND_MODE_ADD
	return mat


static func make_soft_orb(size: int = 128, inner: Color = GOLD_BRIGHT, outer: Color = Color(1, 1, 1, 0)) -> GradientTexture2D:
	var g := Gradient.new()
	g.offsets = PackedFloat32Array([0.0, 0.12, 0.42, 1.0])
	g.colors = PackedColorArray([Color.WHITE, inner, inner.lerp(outer, 0.5), outer])
	var tex := GradientTexture2D.new()
	tex.gradient = g
	tex.width = size
	tex.height = size
	tex.fill = GradientTexture2D.FILL_RADIAL
	tex.fill_from = Vector2(0.5, 0.5)
	tex.fill_to = Vector2(0.5, 0.0)
	return tex


static func make_color_ramp(colors: Array) -> GradientTexture1D:
	var g := Gradient.new()
	var offsets := PackedFloat32Array()
	var packed := PackedColorArray()
	for i in colors.size():
		offsets.append(float(i) / max(1, colors.size() - 1))
		packed.append(colors[i])
	g.offsets = offsets
	g.colors = packed
	var tex := GradientTexture1D.new()
	tex.gradient = g
	return tex
