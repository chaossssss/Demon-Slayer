extends Node2D

## A：冷青回春环 —— 细线 + 上升光尘，无印无符

const Fx = preload("res://scripts/fx_palette.gd")

var _tw: Tween
var _outer: Line2D
var _inner: Line2D
var _glow: Sprite2D
var _shock: Node2D


func _ready() -> void:
	material = Fx.make_glow_material()
	_glow = Sprite2D.new()
	_glow.texture = Fx.make_soft_orb(160, Fx.JADE_GLOW, Color(1, 1, 1, 0))
	_glow.modulate.a = 0.0
	_outer = _ring(52.0, 1.6, Fx.STEEL)
	_inner = _ring(28.0, 1.0, Fx.ICE)
	_shock = preload("res://scripts/fx_shockwave.gd").new()
	_shock.ring_count = 1
	_shock.max_radius = 90.0
	_shock.color = Fx.JADE_GLOW
	_shock.duration = 0.28
	add_child(_glow)
	add_child(_outer)
	add_child(_inner)
	add_child(_shock)
	modulate.a = 0.0


func _ring(r: float, width: float, color: Color) -> Line2D:
	var line := Line2D.new()
	line.width = width
	line.default_color = color
	line.closed = true
	line.antialiased = true
	for i in 32:
		var a: float = TAU * float(i) / 32.0
		line.add_point(Vector2(cos(a), sin(a)) * r)
	return line


func play() -> void:
	if _tw:
		_tw.kill()
	modulate.a = 1.0
	scale = Vector2(0.7, 0.7)
	_glow.modulate.a = 0.0
	_shock.play()
	_tw = create_tween()
	_tw.set_parallel(true)
	_tw.tween_property(self, "scale", Vector2(1.08, 1.08), 0.08).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	_tw.tween_property(_glow, "modulate:a", 0.5, 0.06)
	_tw.tween_property(_outer, "scale", Vector2(1.15, 1.15), 0.45)
	_tw.tween_property(self, "modulate:a", 0.0, 0.4).set_delay(0.2)
	_tw.tween_property(_glow, "modulate:a", 0.0, 0.4).set_delay(0.2)
