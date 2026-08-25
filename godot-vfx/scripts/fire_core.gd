extends Node2D

## A：冷焰 —— 白芯 + 青钢焰缘，干净不糊

const Fx = preload("res://scripts/fx_palette.gd")

var _tw: Tween
var _base: Sprite2D
var _core: Sprite2D
var _shock: Node2D


func _ready() -> void:
	material = Fx.make_glow_material()
	_base = Sprite2D.new()
	_base.texture = Fx.make_soft_orb(200, Fx.EDGE, Color(1, 1, 1, 0))
	_base.position = Vector2(0, 14)
	_base.scale = Vector2(0.85, 1.1)
	_base.modulate.a = 0.0
	_core = Sprite2D.new()
	_core.texture = Fx.make_soft_orb(90, Fx.ICE, Color(1, 1, 1, 0))
	_core.position = Vector2(0, 4)
	_core.modulate.a = 0.0
	_shock = preload("res://scripts/fx_shockwave.gd").new()
	_shock.ring_count = 1
	_shock.max_radius = 70.0
	_shock.color = Fx.EDGE
	_shock.duration = 0.18
	add_child(_base)
	add_child(_core)
	add_child(_shock)


func play() -> void:
	if _tw:
		_tw.kill()
	_base.modulate.a = 0.0
	_core.modulate.a = 0.0
	_base.scale = Vector2(0.35, 0.45)
	_core.scale = Vector2(0.3, 0.3)
	_shock.play()
	_tw = create_tween()
	_tw.set_parallel(true)
	_tw.tween_property(_base, "modulate:a", 0.75, 0.04)
	_tw.tween_property(_core, "modulate:a", 1.0, 0.03)
	_tw.tween_property(_base, "scale", Vector2(1.05, 1.45), 0.1).set_trans(Tween.TRANS_EXPO).set_ease(Tween.EASE_OUT)
	_tw.tween_property(_core, "position:y", -20.0, 0.4)
	_tw.tween_property(_base, "modulate:a", 0.0, 0.35).set_delay(0.12)
	_tw.tween_property(_core, "modulate:a", 0.0, 0.35).set_delay(0.12)
