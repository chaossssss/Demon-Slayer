extends Node2D

const Fx = preload("res://scripts/fx_palette.gd")

const SIDES := 8
const RADIUS := 66.0

var _tw: Tween
var _fill: Polygon2D
var _rim: Line2D
var _inner: Line2D
var _bagua: Line2D
var _runes: Array[Line2D] = []
var _glow: Sprite2D
var _ripple: Node2D
var _talisman: Node2D


func _ready() -> void:
	material = Fx.make_glow_material()
	var pts := _oct_points(RADIUS)
	_glow = Sprite2D.new()
	_glow.texture = Fx.make_soft_orb(220, Color(0.35, 0.55, 0.62, 0.8), Color(1, 1, 1, 0))
	_glow.modulate.a = 0.0
	_fill = Polygon2D.new()
	_fill.polygon = pts
	_fill.color = Color(0.22, 0.34, 0.38, 0.18)
	_fill.antialiased = true
	_rim = _make_loop(pts, 3.2, Fx.GOLD)
	_inner = _make_loop(_oct_points(RADIUS * 0.68), 1.4, Fx.AQUA.lightened(0.25))
	_bagua = _make_bagua()
	for i in 6:
		var rune := _make_rune(i)
		_runes.append(rune)
	_ripple = preload("res://scripts/fx_shockwave.gd").new()
	_ripple.ring_count = 1
	_ripple.max_radius = 125.0
	_ripple.color = Fx.GOLD
	_ripple.duration = 0.45
	_talisman = preload("res://scripts/fx_talisman.gd").new()
	_talisman.count = 2
	_talisman.spread = 36.0
	add_child(_glow)
	add_child(_fill)
	add_child(_rim)
	add_child(_inner)
	add_child(_bagua)
	for r in _runes:
		add_child(r)
	add_child(_ripple)
	add_child(_talisman)
	modulate.a = 0.0
	scale = Vector2(0.25, 0.25)


func _oct_points(r: float) -> PackedVector2Array:
	var pts := PackedVector2Array()
	for i in SIDES:
		var a: float = (TAU * float(i) / float(SIDES)) - PI * 0.5
		pts.append(Vector2(cos(a), sin(a) * 1.06) * r)
	return pts


func _make_loop(pts: PackedVector2Array, width: float, color: Color) -> Line2D:
	var line := Line2D.new()
	line.points = pts
	line.closed = true
	line.width = width
	line.default_color = color
	line.antialiased = true
	line.joint_mode = Line2D.LINE_JOINT_ROUND
	return line


func _make_bagua() -> Line2D:
	var line := Line2D.new()
	line.width = 1.2
	line.default_color = Color(Fx.GOLD.r, Fx.GOLD.g, Fx.GOLD.b, 0.65)
	line.antialiased = true
	line.closed = true
	for i in 3:
		var a: float = TAU * float(i) / 3.0 - PI * 0.5
		line.add_point(Vector2(cos(a), sin(a)) * 22.0)
	return line


func _make_rune(i: int) -> Line2D:
	var line := Line2D.new()
	line.width = 1.1
	line.default_color = Fx.BLOOD
	line.antialiased = true
	var a: float = TAU * float(i) / 6.0
	var p: Vector2 = Vector2(cos(a), sin(a)) * RADIUS * 0.82
	line.add_point(p)
	line.add_point(p + Vector2(cos(a + 0.4), sin(a + 0.4)) * 10.0)
	line.modulate.a = 0.0
	return line


func play() -> void:
	if _tw:
		_tw.kill()
	modulate.a = 1.0
	scale = Vector2(0.2, 0.2)
	rotation = -0.1
	_glow.modulate.a = 0.0
	_bagua.modulate.a = 0.0
	for r in _runes:
		r.modulate.a = 0.0
	_ripple.play()
	_talisman.play()
	_tw = create_tween()
	_tw.set_parallel(true)
	_tw.tween_property(self, "scale", Vector2(1.1, 1.1), 0.12).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	_tw.tween_property(self, "rotation", TAU * 0.06, 0.65)
	_tw.tween_property(_glow, "modulate:a", 0.6, 0.1)
	_tw.tween_property(_bagua, "modulate:a", 1.0, 0.08)
	_tw.tween_property(_bagua, "rotation", TAU * 0.25, 0.65)
	for r in _runes:
		_tw.tween_property(r, "modulate:a", 0.9, 0.08)
		_tw.tween_property(r, "modulate:a", 0.0, 0.4).set_delay(0.2)
	_tw.tween_property(self, "modulate:a", 0.0, 0.5).set_delay(0.22)
	_tw.tween_property(_glow, "modulate:a", 0.0, 0.5).set_delay(0.22)
