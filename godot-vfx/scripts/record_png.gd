extends Node

@export var fps: int = 30
@export var seconds: float = 1.2

func record(vfx: Node2D, tag: String) -> void:
	if vfx == null:
		push_warning("没有正在播放的特效")
		return
	var abs_dir: String = ProjectSettings.globalize_path("res://export/%s" % tag)
	DirAccess.make_dir_recursive_absolute(abs_dir)
	vfx.play()
	var frames: int = int(round(float(fps) * seconds))
	var vp: Viewport = get_viewport()
	await RenderingServer.frame_post_draw
	for i in frames:
		await RenderingServer.frame_post_draw
		var img: Image = vp.get_texture().get_image()
		img.save_png("%s/%03d.png" % [abs_dir, i])
	print("已导出 %s：%d 帧 -> %s" % [tag, frames, abs_dir])
