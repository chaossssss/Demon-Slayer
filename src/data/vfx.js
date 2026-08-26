/** 有序列帧素材时优先播帧；否则回退代码粒子 */
export const VFX_DURATION = {
  slash: 400,
  pierce: 400,
  whirl: 420,
  heavy: 430,
  impact: 450,
  fire: 450,
  heal: 500,
  shield: 450,
  smoke: 480,
  mana: 500,
}

const SPRITE = (dir, frameMs = 50) => ({
  dir,
  frames: 8,
  frameMs,
  blend: 'screen',
})

/** tag → 帧目录（public 下），帧数与每帧毫秒 */
export const VFX_SPRITE = {
  slash: SPRITE('/vfx/slash', 50),
  pierce: SPRITE('/vfx/pierce', 48),
  whirl: SPRITE('/vfx/whirl', 52),
  heavy: SPRITE('/vfx/heavy', 52),
  impact: SPRITE('/vfx/impact', 55),
  fire: SPRITE('/vfx/fire', 55),
  heal: SPRITE('/vfx/heal', 60),
  shield: SPRITE('/vfx/shield', 55),
  smoke: SPRITE('/vfx/smoke', 58),
  mana: SPRITE('/vfx/mana', 58),
  'slash-ult': SPRITE('/vfx/slash-ult', 52),
  'pierce-ult': SPRITE('/vfx/pierce-ult', 50),
  'whirl-ult': SPRITE('/vfx/whirl-ult', 54),
  'heavy-ult': SPRITE('/vfx/heavy-ult', 54),
  'impact-ult': SPRITE('/vfx/impact-ult', 56),
  'fire-ult': SPRITE('/vfx/fire-ult', 56),
  'heal-ult': SPRITE('/vfx/heal-ult', 62),
  'shield-ult': SPRITE('/vfx/shield-ult', 56),
  'smoke-ult': SPRITE('/vfx/smoke-ult', 60),
  'mana-ult': SPRITE('/vfx/mana-ult', 60),
}

export function getSpriteSpec(tag) {
  return VFX_SPRITE[tag] || null
}

/** 三星大招优先播 tag-ult；无素材时回退基础 tag */
export function resolveVfxTag(tag, ult = false) {
  if (!ult || !tag) return tag
  const ultTag = `${tag}-ult`
  return VFX_SPRITE[ultTag] ? ultTag : tag
}

/**
 * 出牌特效：hero 叠在玩家身上，targets 叠在每个选中的敌人身上。
 * 三星走 resolveVfxTag → *-ult 加强帧。
 */
export const CARD_VFX = {
  slash: { hero: ['slash'], targets: ['slash'] },
  focus_strike: { hero: ['heavy'], targets: ['heavy'] },
  whirlwind: { hero: ['whirl'], targets: ['whirl'] },
  heavy_slash: { hero: ['heavy'], targets: ['heavy'] },
  stab: { hero: ['pierce'], targets: ['pierce'] },
  execute: { hero: ['pierce'], targets: ['pierce'] },
  backstab: { hero: ['pierce'], targets: ['pierce'] },
  bash: { hero: ['impact'], targets: ['impact', 'slash'] },
  ember: { hero: ['fire'], targets: ['fire'] },
  inferno: { hero: ['fire'], targets: ['fire'] },
  ward: { hero: ['shield', 'heal'], targets: ['fire'] },
  guard: { hero: ['shield'], targets: [] },
  iron_wall: { hero: ['shield'], targets: [] },
  riposte: { hero: ['shield'], targets: [] },
  fortify: { hero: ['shield'], targets: [] },
  heal_potion: { hero: ['heal'], targets: [] },
  smoke: { hero: ['smoke'], targets: [] },
  mana_surge: { hero: ['mana'], targets: [] },
}

export function getCardVfx(cardId) {
  return CARD_VFX[cardId] || { hero: [], targets: [] }
}

export function vfxPlayDuration(cardId, star = 1) {
  const spec = getCardVfx(cardId)
  const tags = [...spec.hero, ...spec.targets]
  const ult = Number(star) >= 3
  const base = tags.reduce((max, tag) => {
    const resolved = resolveVfxTag(tag, ult)
    const sprite = getSpriteSpec(resolved)
    const dur = sprite ? sprite.frames * sprite.frameMs : VFX_DURATION[tag] || 480
    return Math.max(max, dur)
  }, 420)
  return ult ? Math.round(base * 1.08) : base
}

export function vfxImpactDelay(cardId) {
  return getCardVfx(cardId).targets.length ? 110 : 0
}
