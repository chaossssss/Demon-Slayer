extends Node2D

const Fx = preload("res://scripts/fx_palette.gd")

@export var count: int = 4
@export var spread: float = 48.0

var _tw: Tween


func play() -> void:
	if _tw:
		_tw.kill()
	for c in get_children():
		c.queue_free()
	_tw = create_tween()
	_tw.set_parallel(true)
	for i in count:
		var paper := _make_paper(i)
		add_child(paper)
		var dir := Vector2(1.0, -0.35 + randf() * 0.7).normalized()
		var delay: float = float(i) * 0.04
		paper.modulate.a = 0.0
		paper.rotation = randf_range(-0.5, 0.5)
		paper.scale = Vector2(0.5, 0.5)
		_tw.tween_property(paper, "modulate:a", 1.0, 0.05).set_delay(delay)
		_tw.tween_property(paper, "scale", Vector2(1.0, 1.0), 0.12).set_delay(delay)
		_tw.tween_property(paper, "position", paper.position + dir * spread, 0.65).set_delay(delay).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		_tw.tween_property(paper, "rotation", paper.rotation + randf_range(-1.2, 1.2), 0.65).set_delay(delay)
		_tw.tween_property(paper, "modulate:a", 0.0, 0.4).set_delay(delay + 0.28)


func _make_paper(seed: int) -> Node2D:
	var node := Node2D.new()
	node.position = Vector2(randf_range(-8, 8), randf_range(-6, 6))
	var body := Polygon2D.new()
	body.color = Color(0.851, 0.796, 0.702, 0.92)
	body.polygon = PackedVector2Array([
		Vector2(-7, -11), Vector2(7, -11), Vector2(7, 11), Vector2(-7, 11),
	])
	body.antialiased = true
	var edge := Line2D.new()
	edge.width = 1.0
	edge.default_color = Fx.GOLD
	edge.closed = true
	edge.antialiased = true
	edge.points = body.polygon
	var glyph := Line2D.new()
	glyph.width = 1.4
	glyph.default_color = Fx.BLOOD
	glyph.begin_cap_mode = Line2D.LINE_CAP_ROUND
	glyph.end_cap_mode = Line2D.LINE_CAP_ROUND
	glyph.antialiased = true
	if seed % 3 == 0:
		glyph.add_point(Vector2(-2, -6))
		glyph.add_point(Vector2(3, 4))
		glyph.add_point(Vector2(-3, 6))
	elif seed % 3 == 1:
		glyph.add_point(Vector2(0, -7))
		glyph.add_point(Vector2(0, 7))
		glyph.add_point(Vector2(4, 0))
	else:
		glyph.add_point(Vector2(-4, 0))
		glyph.add_point(Vector2(4, -3))
		glyph.add_point(Vector2(2, 6))
	node.add_child(body)
	node.add_child(edge)
	node.add_child(glyph)
	return node
