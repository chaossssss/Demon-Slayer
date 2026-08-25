extends Node2D

@onready var bg: Control = $Bg
@onready var hint: Label = $UI/Hint
@onready var stage: Node2D = $Stage
@onready var recorder: Node = $Recorder

var _green := false
var _current: Node2D
var _ult := false

func _ready() -> void:
	_play("slash")


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		match event.keycode:
			KEY_1:
				_play("slash")
			KEY_2:
				_play("fire")
			KEY_3:
				_play("heal")
			KEY_4:
				_play("shield")
			KEY_5:
				_play("smoke")
			KEY_G:
				_green = not _green
				if bg is TextureRect:
					bg.modulate = Color(0.35, 1.0, 0.35, 1.0) if _green else Color.WHITE
				elif bg is ColorRect:
					bg.color = Color(0, 1, 0, 1) if _green else Color(0.11, 0.09, 0.07, 1)
				_refresh_hint()
			KEY_U:
				_ult = not _ult
				_apply_ult()
				_refresh_hint()
			KEY_SPACE:
				if _current:
					_current.play()
			KEY_R:
				if _current:
					hint.visible = false
					await recorder.record(_current, _current.name.to_lower())
					hint.visible = true


func _play(tag: String) -> void:
	for child in stage.get_children():
		child.visible = child.name.to_lower() == tag
		if child.visible:
			_current = child
			_apply_ult()
			child.play()
	_refresh_hint()


func _apply_ult() -> void:
	if _current == null:
		return
	_current.scale = Vector2(1.35, 1.35) if _ult else Vector2.ONE


func _refresh_hint() -> void:
	var effect_name: String = _current.name if _current else "?"
	hint.text = "1斩击 2业火 3治疗 4护盾 5烟雾 | 空格重播 | G绿幕:%s | U大招:%s | R导出PNG\n当前：%s" % [
		"开" if _green else "关",
		"开" if _ult else "关",
		effect_name,
	]
