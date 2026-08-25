extends Node2D

const Fx = preload("res://scripts/fx_palette.gd")

var _tw: Tween
var _ink_a: Sprite2D
var _ink_b: Sprite2D
var _ink_c: Sprite2D
var _brush: Line2D
var _talismans: Node2D


func _ready() -> void:
	_ink_a = _make_ink(Fx.PURPLE.darkened(0.2), Vector2(-12, 8))
	_ink_b = _make_ink(Color(0.1, 0.08, 0.07, 1), Vector2(14, -2))
	_ink_c = _make_ink(Color(0.608, 0.176, 0.118, 0.55), Vector2(4, -10))
	_brush = Line2D.new()
	_brush.width = 8.0
	_brush.default_color = Color(0.851, 0.796, 0.702, 0.55)
	_brush.begin_cap_mode = Line2D.LINE_CAP_ROUND
	_brush.end_cap_mode = Line2D.LINE_CAP_ROUND
	_brush.antialiased = true
	_brush.add_point(Vector2(-50, 16))
	_brush.add_point(Vector2(20, 4))
	_brush.add_point(Vector2(88, -14))
	_brush.modulate.a = 0.0
	_talismans = preload("res://scripts/fx_talisman.gd").new()
	_talismans.count = 3
	_talismans.spread = 64.0
	add_child(_ink_a)
	add_child(_ink_b)
	add_child(_ink_c)
	add_child(_brush)
	add_child(_talismans)


func _make_ink(tint: Color, offset: Vector2) -> Sprite2D:
	var s := Sprite2D.new()
	s.texture = Fx.make_soft_orb(220, tint, Color(1, 1, 1, 0))
	s.position = offset
	s.modulate.a = 0.0
	return s


func play() -> void:
	if _tw:
		_tw.kill()
	for s in [_ink_a, _ink_b, _ink_c]:
		s.modulate.a = 0.0
		s.scale = Vector2(0.25, 0.25)
	_brush.modulate.a = 0.0
	_brush.width = 10.0
	_talismans.play()
	_tw = create_tween()
	_tw.set_parallel(true)
	_tw.tween_property(_brush, "modulate:a", 0.75, 0.05)
	_tw.tween_property(_brush, "width", 1.5, 0.35)
	_tw.tween_property(_brush, "modulate:a", 0.0, 0.35).set_delay(0.08)
	_tw.tween_property(_ink_a, "modulate:a", 0.65, 0.08)
	_tw.tween_property(_ink_b, "modulate:a", 0.5, 0.06).set_delay(0.03)
	_tw.tween_property(_ink_c, "modulate:a", 0.35, 0.05).set_delay(0.05)
	_tw.tween_property(_ink_a, "scale", Vector2(2.0, 1.45), 0.7)
	_tw.tween_property(_ink_b, "scale", Vector2(2.2, 1.55), 0.75).set_delay(0.03)
	_tw.tween_property(_ink_a, "position", Vector2(48, -24), 0.7)
	_tw.tween_property(_ink_b, "position", Vector2(58, -30), 0.75).set_delay(0.03)
	_tw.tween_property(_ink_a, "modulate:a", 0.0, 0.5).set_delay(0.25)
	_tw.tween_property(_ink_b, "modulate:a", 0.0, 0.5).set_delay(0.3)
	_tw.tween_property(_ink_c, "modulate:a", 0.0, 0.45).set_delay(0.32)
