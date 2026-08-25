extends Node2D

## A：极短 punch，不抖花

var _punch: Tween


func play() -> void:
	if _punch:
		_punch.kill()
	scale = Vector2(0.98, 0.98)
	_punch = create_tween()
	_punch.tween_property(self, "scale", Vector2(1.03, 1.03), 0.04).set_trans(Tween.TRANS_EXPO).set_ease(Tween.EASE_OUT)
	_punch.tween_property(self, "scale", Vector2.ONE, 0.1).set_delay(0.04)
	for child in get_children():
		if child.has_method("play"):
			child.play()
		elif child is GPUParticles2D:
			child.restart()
			child.emitting = true
