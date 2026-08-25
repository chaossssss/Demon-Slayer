extends Node2D

const Fx = preload("res://scripts/fx_palette.gd")

@export var ghost_count: int = 4
@export var stroke_color: Color = Fx.BLOOD
@export var tail_color: Color = Fx.GOLD

var _strokes: Array[Line2D] = []
var _tw: Tween


func _ready() -> void:
	material = Fx.make_glow_material()
	for i in ghost_count:
		var line := Line2D.new()
		line.width = 16.0 - float(i) * 2.8
		line.begin_cap_mode = Line2D.LINE_CAP_ROUND
		line.end_cap_mode = Line2D.LINE_CAP_ROUND
		line.antialiased = true
		line.gradient = _stroke_gradient(i)
		for p in _stroke_points():
			line.add_point(p)
		line.modulate.a = 0.0
		_strokes.append(line)
		add_child(line)


func _stroke_points() -> Array:
	var pts: Array = []
	for i in 37:
		var t: float = float(i) / 36.0
		var x: float = lerpf(-58.0, 168.0, t)
		var y: float = lerpf(26.0, -18.0, t) + sin(t * PI) * 38.0 - cos(t * 1.6) * 8.0
		pts.append(Vector2(x, y))
	return pts


func _stroke_gradient(layer: int) -> Gradient:
	var g := Gradient.new()
	var fade := 1.0 - float(layer) * 0.18
	g.offsets = PackedFloat32Array([0.0, 0.18, 0.55, 0.82, 1.0])
	g.colors = PackedColorArray([
		Color(stroke_color.r, stroke_color.g, stroke_color.b, 0.0),
		Color(stroke_color.r, stroke_color.g, stroke_color.b, 0.45 * fade),
		Color(tail_color.r, tail_color.g, tail_color.b, 0.95 * fade),
		Color(1, 0.96, 0.82, 0.75 * fade),
		Color(1, 1, 1, 0.0),
	])
	return g


func play() -> void:
	if _tw:
		_tw.kill()
	for i in _strokes.size():
		var line := _strokes[i]
		line.modulate.a = 0.0
		line.width = 18.0 - float(i) * 3.0
		var delay: float = float(i) * 0.03
		var tw := create_tween()
		tw.set_parallel(true)
		tw.tween_property(line, "modulate:a", 0.92 - float(i) * 0.14, 0.04).set_delay(delay)
		tw.tween_property(line, "width", 3.0, 0.55).set_delay(delay + 0.02)
		tw.tween_property(line, "modulate:a", 0.0, 0.48).set_delay(delay + 0.1)
