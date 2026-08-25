extends Node2D

const Fx = preload("res://scripts/fx_palette.gd")

var _tw: Tween
var _base: Sprite2D
var _core: Sprite2D
var _ripple: Node2D
var _talismans: Node2D
var _chars: Array[Node2D] = []


func _ready() -> void:
	material = Fx.make_glow_material()
	_base = Sprite2D.new()
	_base.texture = Fx.make_soft_orb(250, Color(0.45, 0.12, 0.08, 0.75), Color(1, 1, 1, 0))
	_base.position = Vector2(0, 18)
	_base.scale = Vector2(1.1, 0.85)
	_base.modulate.a = 0.0
	_core = Sprite2D.new()
	_core.texture = Fx.make_soft_orb(120, Fx.BLOOD, Color(1, 1, 1, 0))
	_core.position = Vector2(0, 6)
	_core.modulate.a = 0.0
	for i in 3:
		var t := preload("res://scripts/fx_talisman.gd").new()
		t.count = 1
		t.spread = 20.0 + float(i) * 8.0
		_chars.append(t)
	_ripple = preload("res://scripts/fx_shockwave.gd").new()
	_ripple.ring_count = 2
	_ripple.max_radius = 95.0
	_ripple.color = Fx.EMBER
	_ripple.duration = 0.38
	_talismans = preload("res://scripts/fx_talisman.gd").new()
	_talismans.count = 5
	_talismans.spread = 58.0
	add_child(_base)
	add_child(_core)
	for t in _chars:
		add_child(t)
	add_child(_ripple)
	add_child(_talismans)


func play() -> void:
	if _tw:
		_tw.kill()
	_base.modulate.a = 0.0
	_core.modulate.a = 0.0
	_base.scale = Vector2(0.35, 0.28)
	_core.scale = Vector2(0.25, 0.25)
	_ripple.play()
	_talismans.play()
	for i in _chars.size():
		_chars[i].position = Vector2(randf_range(-12, 12), randf_range(-4, 8))
		_chars[i].play()
	_tw = create_tween()
	_tw.set_parallel(true)
	_tw.tween_property(_base, "modulate:a", 0.85, 0.06)
	_tw.tween_property(_core, "modulate:a", 0.95, 0.05)
	_tw.tween_property(_base, "scale", Vector2(1.55, 1.15), 0.18)
	_tw.tween_property(_core, "position:y", -18.0, 0.55)
	_tw.tween_property(_base, "modulate:a", 0.0, 0.5).set_delay(0.18)
	_tw.tween_property(_core, "modulate:a", 0.0, 0.5).set_delay(0.18)
