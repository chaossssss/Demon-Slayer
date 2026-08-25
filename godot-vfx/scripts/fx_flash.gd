extends Sprite2D

const Fx = preload("res://scripts/fx_palette.gd")

var _tw: Tween


func _ready() -> void:
	texture = Fx.make_soft_orb(160, Fx.ICE, Color(1, 1, 1, 0))
	centered = true
	modulate.a = 0.0


func play() -> void:
	if _tw:
		_tw.kill()
	scale = Vector2(0.2, 0.15)
	modulate = Color(0.9, 0.96, 1.0, 0.85)
	_tw = create_tween()
	_tw.set_parallel(true)
	_tw.tween_property(self, "scale", Vector2(1.4, 0.55), 0.06).set_trans(Tween.TRANS_EXPO).set_ease(Tween.EASE_OUT)
	_tw.tween_property(self, "modulate:a", 0.0, 0.08).set_delay(0.02)
