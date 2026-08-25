extends Node2D

## A：薄冷结界 —— 菱形锋线，无八卦无符纸

const Fx = preload("res://scripts/fx_palette.gd")

var _tw: Tween
var _fill: Polygon2D
var _rim: Line2D
var _inner: Line2D
var _glow: Sprite2D
var _shock: Node2D


func _ready() -> void:
	material = Fx.make_glow_material()
	var pts := _diamond(58.0)
	_glow = Sprite2D.new()
	_glow.texture = Fx.make_soft_orb(180, Fx.STEEL, Color(1, 1, 1, 0))
	_glow.modulate.a = 0.0
	_fill = Polygon2D.new()
	_fill.polygon = pts
	_fill.color = Color(0.45, 0.65, 0.85, 0.08)
	_fill.antialiased = true
	_rim = _loop(pts, 2.0, Fx.ICE)
	_inner = _loop(_diamond(36.0), 1.0, Fx.STEEL)
	_shock = preload("res://scripts/fx_shockwave.gd").new()
	_shock.ring_count = 1
	_shock.max_radius = 100.0
	_shock.color = Fx.STEEL
	_shock.duration = 0.2
	add_child(_glow)
	add_child(_fill)
	add_child(_rim)
	add_child(_inner)
	add_child(_shock)
	modulate.a = 0.0
	scale = Vector2(0.3, 0.3)


func _diamond(r: float) -> PackedVector2Array:
	return PackedVector2Array([
		Vector2(0, -r),
		Vector2(r * 0.72, 0),
		Vector2(0, r * 0.95),
		Vector2(-r * 0.72, 0),
	])


func _loop(pts: PackedVector2Array, width: float, color: Color) -> Line2D:
	var line := Line2D.new()
	line.points = pts
	line.closed = true
	line.width = width
	line.default_color = color
	line.antialiased = true
	line.joint_mode = Line2D.LINE_JOINT_SHARP
	return line


func play() -> void:
	if _tw:
		_tw.kill()
	modulate.a = 1.0
	scale = Vector2(0.25, 0.25)
	rotation = 0.0
	_glow.modulate.a = 0.0
	_shock.play()
	_tw = create_tween()
	_tw.set_parallel(true)
	_tw.tween_property(self, "scale", Vector2(1.05, 1.05), 0.06).set_trans(Tween.TRANS_EXPO).set_ease(Tween.EASE_OUT)
	_tw.tween_property(_glow, "modulate:a", 0.45, 0.05)
	_tw.tween_property(self, "modulate:a", 0.0, 0.28).set_delay(0.12)
	_tw.tween_property(_glow, "modulate:a", 0.0, 0.28).set_delay(0.12)
