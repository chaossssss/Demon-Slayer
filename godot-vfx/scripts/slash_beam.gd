extends Node2D

const Fx = preload("res://scripts/fx_palette.gd")

const ARC_STEPS := 36

var _tw: Tween
var _ink: Node2D
var _arc_outer: Line2D
var _arc_gold: Line2D
var _wash: Sprite2D
var _ripple: Node2D
var _talismans: Node2D


func _ready() -> void:
	material = Fx.make_glow_material()
	_ink = preload("res://scripts/fx_ink_trail.gd").new()
	_ink.ghost_count = 5
	_wash = Sprite2D.new()
	_wash.texture = Fx.make_soft_orb(240, Color(0.18, 0.06, 0.05, 0.8), Color(1, 1, 1, 0))
	_wash.scale = Vector2(1.8, 0.75)
	_wash.position = Vector2(48, 2)
	_wash.modulate.a = 0.0
	_arc_outer = _make_arc(10.0, [
		Color(0.11, 0.05, 0.04, 0.0),
		Color(0.608, 0.176, 0.118, 0.75),
		Color(0.788, 0.635, 0.153, 0.9),
		Color(1.0, 0.93, 0.72, 0.0),
	])
	_arc_gold = _make_arc(4.0, [
		Color(1, 1, 1, 0),
		Color(1, 0.96, 0.82, 1),
		Color(0.788, 0.635, 0.153, 0.85),
		Color(1, 1, 1, 0),
	])
	_ripple = preload("res://scripts/fx_shockwave.gd").new()
	_ripple.ring_count = 2
	_ripple.max_radius = 150.0
	_ripple.color = Color(0.608, 0.176, 0.118, 0.65)
	_ripple.duration = 0.48
	_talismans = preload("res://scripts/fx_talisman.gd").new()
	_talismans.count = 3
	_talismans.spread = 72.0
	add_child(_wash)
	add_child(_arc_outer)
	add_child(_arc_gold)
	add_child(_ink)
	add_child(_ripple)
	add_child(_talismans)
	_reset_visual()


func _make_arc(width: float, colors: Array) -> Line2D:
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
	for i in ARC_STEPS + 1:
		var t: float = float(i) / float(ARC_STEPS)
		var a: float = lerpf(-2.35, 0.85, t)
		line.add_point(Vector2(cos(a), sin(a) * 0.52) * (128.0 + t * 18.0))
	line.modulate.a = 0.0
	return line


func _reset_visual() -> void:
	rotation = -0.62
	scale = Vector2(0.9, 1.0)
	_arc_outer.modulate.a = 0.0
	_arc_gold.modulate.a = 0.0
	_wash.modulate.a = 0.0
	_arc_outer.width = 12.0
	_arc_gold.width = 5.0


func play() -> void:
	if _tw:
		_tw.kill()
	_reset_visual()
	_ink.play()
	_ripple.play()
	_talismans.play()
	_tw = create_tween()
	_tw.set_parallel(true)
	_tw.tween_property(self, "rotation", 0.55, 0.14).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	_tw.tween_property(self, "scale", Vector2(1.22, 1.02), 0.14)
	_tw.tween_property(_wash, "modulate:a", 0.55, 0.06)
	_tw.tween_property(_wash, "scale", Vector2(2.6, 1.0), 0.42)
	_tw.tween_property(_arc_outer, "modulate:a", 0.95, 0.04)
	_tw.tween_property(_arc_gold, "modulate:a", 1.0, 0.04).set_delay(0.02)
	_tw.tween_property(_arc_outer, "width", 2.0, 0.55)
	_tw.tween_property(_arc_gold, "width", 1.0, 0.55)
	_tw.tween_property(_arc_outer, "modulate:a", 0.0, 0.55).set_delay(0.12)
	_tw.tween_property(_arc_gold, "modulate:a", 0.0, 0.55).set_delay(0.12)
	_tw.tween_property(_wash, "modulate:a", 0.0, 0.55).set_delay(0.1)
