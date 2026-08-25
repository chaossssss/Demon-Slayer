extends Node2D

## A：薄烟残影 —— 青灰丝带，无墨团

const Fx = preload("res://scripts/fx_palette.gd")

var _tw: Tween
var _a: Sprite2D
var _b: Sprite2D
var _streak: Line2D


func _ready() -> void:
	_a = _wisp(Fx.PURPLE, Vector2(-6, 4))
	_b = _wisp(Color(0.45, 0.55, 0.68, 0.7), Vector2(10, -2))
	_streak = Line2D.new()
	_streak.width = 1.6
	_streak.default_color = Color(0.75, 0.88, 1.0, 0.7)
	_streak.begin_cap_mode = Line2D.LINE_CAP_ROUND
	_streak.end_cap_mode = Line2D.LINE_CAP_ROUND
	_streak.antialiased = true
	_streak.add_point(Vector2(-36, 10))
	_streak.add_point(Vector2(70, -12))
	_streak.modulate.a = 0.0
	add_child(_a)
	add_child(_b)
	add_child(_streak)


func _wisp(tint: Color, offset: Vector2) -> Sprite2D:
	var s := Sprite2D.new()
	s.texture = Fx.make_soft_orb(160, tint, Color(1, 1, 1, 0))
	s.position = offset
	s.modulate.a = 0.0
	return s


func play() -> void:
	if _tw:
		_tw.kill()
	for s in [_a, _b]:
		s.modulate.a = 0.0
		s.scale = Vector2(0.2, 0.15)
	_streak.modulate.a = 0.0
	_streak.width = 2.2
	_tw = create_tween()
	_tw.set_parallel(true)
	_tw.tween_property(_streak, "modulate:a", 0.9, 0.02)
	_tw.tween_property(_streak, "width", 0.4, 0.16)
	_tw.tween_property(_streak, "modulate:a", 0.0, 0.14).set_delay(0.04)
	_tw.tween_property(_a, "modulate:a", 0.45, 0.05)
	_tw.tween_property(_b, "modulate:a", 0.35, 0.05).set_delay(0.02)
	_tw.tween_property(_a, "scale", Vector2(1.4, 0.85), 0.45)
	_tw.tween_property(_b, "scale", Vector2(1.55, 0.9), 0.5).set_delay(0.02)
	_tw.tween_property(_a, "position", Vector2(36, -16), 0.45)
	_tw.tween_property(_b, "position", Vector2(48, -20), 0.5).set_delay(0.02)
	_tw.tween_property(_a, "modulate:a", 0.0, 0.35).set_delay(0.15)
	_tw.tween_property(_b, "modulate:a", 0.0, 0.35).set_delay(0.18)
