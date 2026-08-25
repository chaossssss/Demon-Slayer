extends Node2D

## A：干净刀光 —— 细白刃 + 青钢外晕 + 极短残影，无符无墨

const Fx = preload("res://scripts/fx_palette.gd")

const ARC_STEPS := 40

var _tw: Tween
var _rim: Line2D
var _blade: Line2D
var _core: Line2D
var _after: Line2D
var _glow: Sprite2D
var _shock: Node2D
var _flash: Sprite2D


func _ready() -> void:
	material = Fx.make_glow_material()
	_glow = Sprite2D.new()
	_glow.texture = Fx.make_soft_orb(140, Fx.STEEL, Color(1, 1, 1, 0))
	_glow.scale = Vector2(1.4, 0.45)
	_glow.modulate.a = 0.0
	_rim = _arc(7.0, [
		Color(0.35, 0.55, 0.75, 0.0),
		Color(0.45, 0.7, 0.95, 0.55),
		Color(0.75, 0.9, 1.0, 0.7),
		Color(1, 1, 1, 0.0),
	])
	_blade = _arc(3.2, [
		Color(0.7, 0.85, 1.0, 0.0),
		Color(0.9, 0.97, 1.0, 1.0),
		Color(1.0, 1.0, 1.0, 1.0),
		Color(0.85, 0.95, 1.0, 0.0),
	])
	_core = _arc(1.2, [
		Color(1, 1, 1, 0),
		Color(1, 1, 1, 1),
		Color(1, 1, 1, 1),
		Color(1, 1, 1, 0),
	])
	_after = _arc(2.0, [
		Color(0.55, 0.78, 0.95, 0.0),
		Color(0.7, 0.88, 1.0, 0.55),
		Color(0.9, 0.96, 1.0, 0.35),
		Color(1, 1, 1, 0),
	])
	_shock = preload("res://scripts/fx_shockwave.gd").new()
	_shock.ring_count = 1
	_shock.max_radius = 110.0
	_shock.color = Fx.STEEL
	_shock.duration = 0.18
	_flash = preload("res://scripts/fx_flash.gd").new()
	add_child(_glow)
	add_child(_rim)
	add_child(_blade)
	add_child(_core)
	add_child(_after)
	add_child(_shock)
	add_child(_flash)
	_reset()


func _arc(width: float, colors: Array) -> Line2D:
	var line := Line2D.new()
	line.width = width
	line.begin_cap_mode = Line2D.LINE_CAP_ROUND
	line.end_cap_mode = Line2D.LINE_CAP_ROUND
	line.antialiased = true
	var g := Gradient.new()
	var offsets := PackedFloat32Array()
	var packed := PackedColorArray()
	for i in colors.size():
		offsets.append(float(i) / max(1, colors.size() - 1))
		packed.append(colors[i])
	g.offsets = offsets
	g.colors = packed
	line.gradient = g
	# 更扁更长的斩弧：像一刀切开空气
	for i in ARC_STEPS + 1:
		var t: float = float(i) / float(ARC_STEPS)
		var a: float = lerpf(-2.55, 0.55, t)
		var r: float = 132.0 + t * 28.0
		line.add_point(Vector2(cos(a), sin(a) * 0.38) * r)
	line.modulate.a = 0.0
	return line


func _reset() -> void:
	rotation = -0.85
	scale = Vector2(0.95, 1.0)
	_rim.modulate.a = 0.0
	_blade.modulate.a = 0.0
	_core.modulate.a = 0.0
	_after.modulate.a = 0.0
	_glow.modulate.a = 0.0
	_rim.width = 8.0
	_blade.width = 3.6
	_core.width = 1.4
	_after.width = 2.2


func play() -> void:
	if _tw:
		_tw.kill()
	_reset()
	_shock.play()
	_flash.play()
	_tw = create_tween()
	_tw.set_parallel(true)
	# 一刀到位，极快
	_tw.tween_property(self, "rotation", 0.72, 0.07).set_trans(Tween.TRANS_EXPO).set_ease(Tween.EASE_OUT)
	_tw.tween_property(self, "scale", Vector2(1.18, 1.0), 0.07)
	_tw.tween_property(_glow, "modulate:a", 0.55, 0.02)
	_tw.tween_property(_glow, "scale", Vector2(2.0, 0.55), 0.1)
	_tw.tween_property(_glow, "modulate:a", 0.0, 0.16).set_delay(0.03)
	_tw.tween_property(_rim, "modulate:a", 0.85, 0.015)
	_tw.tween_property(_blade, "modulate:a", 1.0, 0.015)
	_tw.tween_property(_core, "modulate:a", 1.0, 0.015)
	_tw.tween_property(_rim, "width", 1.0, 0.2)
	_tw.tween_property(_blade, "width", 0.6, 0.2)
	_tw.tween_property(_core, "width", 0.35, 0.2)
	_tw.tween_property(_rim, "modulate:a", 0.0, 0.16).set_delay(0.04)
	_tw.tween_property(_blade, "modulate:a", 0.0, 0.16).set_delay(0.04)
	_tw.tween_property(_core, "modulate:a", 0.0, 0.16).set_delay(0.04)
	# 残影晚半拍，更冷更淡
	_tw.tween_property(_after, "modulate:a", 0.55, 0.02).set_delay(0.045)
	_tw.tween_property(_after, "rotation", 0.12, 0.08).set_delay(0.045)
	_tw.tween_property(_after, "width", 0.4, 0.14).set_delay(0.05)
	_tw.tween_property(_after, "modulate:a", 0.0, 0.12).set_delay(0.07)
