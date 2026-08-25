extends Node2D

const Fx = preload("res://scripts/fx_palette.gd")

@export var ring_count: int = 1
@export var max_radius: float = 100.0
@export var color: Color = Fx.STEEL
@export var duration: float = 0.22

var _tw: Tween


func play() -> void:
	if _tw:
		_tw.kill()
	for c in get_children():
		c.queue_free()
	_tw = create_tween()
	_tw.set_parallel(true)
	for i in ring_count:
		var ring := _make_ring()
		add_child(ring)
		var delay: float = float(i) * 0.04
		ring.scale = Vector2(0.2, 0.2)
		ring.modulate = Color(color.r, color.g, color.b, 0.7)
		_tw.tween_property(ring, "scale", Vector2(max_radius / 96.0, max_radius / 96.0 * 0.45), duration).set_delay(delay).set_trans(Tween.TRANS_EXPO).set_ease(Tween.EASE_OUT)
		_tw.tween_property(ring, "modulate:a", 0.0, duration * 0.75).set_delay(delay + 0.04)


func _make_ring() -> Line2D:
	var line := Line2D.new()
	line.width = 1.2
	line.default_color = color
	line.closed = true
	line.antialiased = true
	for i in 24:
		var a: float = TAU * float(i) / 24.0
		line.add_point(Vector2(cos(a), sin(a) * 0.42) * 96.0)
	return line
