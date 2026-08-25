extends Node2D

const Fx = preload("res://scripts/fx_palette.gd")

@export var ring_count: int = 2
@export var max_radius: float = 120.0
@export var color: Color = Fx.GOLD
@export var duration: float = 0.42

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
		var delay: float = float(i) * 0.07
		ring.scale = Vector2(0.12, 0.12)
		ring.modulate = Color(color.r, color.g, color.b, 0.55)
		_tw.tween_property(ring, "scale", Vector2(max_radius / 96.0, max_radius / 96.0 * 0.55), duration).set_delay(delay).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		_tw.tween_property(ring, "modulate:a", 0.0, duration * 0.9).set_delay(delay + duration * 0.15)


func _make_ring() -> Line2D:
	var line := Line2D.new()
	line.width = 2.0
	line.default_color = color
	line.closed = true
	line.antialiased = true
	for i in 28:
		var a: float = TAU * float(i) / 28.0
		var wobble: float = 1.0 + sin(a * 5.0) * 0.04
		line.add_point(Vector2(cos(a), sin(a) * 0.55) * 96.0 * wobble)
	return line
