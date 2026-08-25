extends Node2D

const Fx = preload("res://scripts/fx_palette.gd")

var _tw: Tween
var _ring_outer: Line2D
var _ring_inner: Line2D
var _seal: Polygon2D
var _pillar: Sprite2D
var _glow: Sprite2D
var _ripple: Node2D
var _talismans: Node2D


func _ready() -> void:
	material = Fx.make_glow_material()
	_glow = Sprite2D.new()
	_glow.texture = Fx.make_soft_orb(200, Fx.JADE_GLOW, Color(1, 1, 1, 0))
	_glow.modulate.a = 0.0
	_pillar = Sprite2D.new()
	_pillar.texture = Fx.make_soft_orb(88, Fx.GOLD_BRIGHT, Color(1, 1, 1, 0))
	_pillar.scale = Vector2(0.3, 1.8)
	_pillar.modulate.a = 0.0
	_ring_outer = _circle_line(60.0, 2.0, Fx.JADE_GLOW)
	_ring_inner = _circle_line(40.0, 1.2, Fx.GOLD)
	_seal = _make_seal()
	_ripple = preload("res://scripts/fx_shockwave.gd").new()
	_ripple.ring_count = 2
	_ripple.max_radius = 105.0
	_ripple.color = Fx.JADE_GLOW
	_ripple.duration = 0.5
	_talismans = preload("res://scripts/fx_talisman.gd").new()
	_talismans.count = 4
	_talismans.spread = 42.0
	add_child(_glow)
	add_child(_pillar)
	add_child(_ring_outer)
	add_child(_ring_inner)
	add_child(_seal)
	add_child(_ripple)
	add_child(_talismans)
	modulate.a = 0.0


func _circle_line(r: float, width: float, color: Color) -> Line2D:
	var line := Line2D.new()
	line.width = width
	line.default_color = color
	line.closed = true
	line.antialiased = true
	for i in 36:
		var a: float = TAU * float(i) / 36.0
		line.add_point(Vector2(cos(a), sin(a)) * r)
	return line


func _make_seal() -> Polygon2D:
	var p := Polygon2D.new()
	p.color = Color(0.608, 0.176, 0.118, 0.85)
	p.polygon = PackedVector2Array([
		Vector2(-10, -10), Vector2(10, -10), Vector2(10, 10), Vector2(-10, 10),
	])
	p.rotation = 0.18
	p.modulate.a = 0.0
	return p


func play() -> void:
	if _tw:
		_tw.kill()
	modulate.a = 1.0
	rotation = 0.0
	scale = Vector2(0.75, 0.75)
	_glow.modulate.a = 0.0
	_pillar.modulate.a = 0.0
	_seal.modulate.a = 0.0
	_seal.scale = Vector2(2.0, 2.0)
	_ripple.play()
	_talismans.play()
	_tw = create_tween()
	_tw.set_parallel(true)
	_tw.tween_property(self, "scale", Vector2(1.08, 1.08), 0.1).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	_tw.tween_property(self, "rotation", TAU * 0.18, 0.95)
	_tw.tween_property(_pillar, "modulate:a", 0.85, 0.06)
	_tw.tween_property(_pillar, "scale", Vector2(0.45, 2.6), 0.2)
	_tw.tween_property(_pillar, "position:y", -32.0, 0.65)
	_tw.tween_property(_seal, "modulate:a", 0.9, 0.05)
	_tw.tween_property(_seal, "scale", Vector2(1.0, 1.0), 0.18).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	_tw.tween_property(_glow, "modulate:a", 0.7, 0.1)
	_tw.tween_property(_glow, "scale", Vector2(1.5, 1.5), 0.8)
	_tw.tween_property(self, "modulate:a", 0.0, 0.55).set_delay(0.35)
	_tw.tween_property(_pillar, "modulate:a", 0.0, 0.55).set_delay(0.28)
	_tw.tween_property(_seal, "modulate:a", 0.0, 0.45).set_delay(0.3)
