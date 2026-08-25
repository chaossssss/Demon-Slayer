extends Node2D

const Fx = preload("res://scripts/fx_palette.gd")

var _punch: Tween


func play() -> void:
	if _punch:
		_punch.kill()
	scale = Vector2(0.94, 0.94)
	_punch = create_tween()
	_punch.tween_property(self, "scale", Vector2(1.06, 1.06), 0.08).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	_punch.tween_property(self, "scale", Vector2.ONE, 0.16).set_delay(0.08)
	for child in get_children():
		if child.has_method("play"):
			child.play()
		elif child is GPUParticles2D:
			child.restart()
			child.emitting = true
