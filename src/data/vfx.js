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
  smoke: 520,
  mana: 500,
}

const SPRITE = (dir, frameMs = 50, extra = 'center center') => {
  const opts = typeof extra === 'string' ? { objectPosition: extra } : extra || {}
  return {
    dir,
    frames: 8,
    frameMs,
    blend: opts.blend || 'screen',
    objectPosition: opts.objectPosition || 'center center',
    /** 帧内含人物：普通混合，出招时隐藏站桩立绘 */
    actorClip: !!opts.actorClip,
  }
}

/** tag → 帧目录（public 下），帧数与每帧毫秒 */
export const VFX_SPRITE = {
  slash: SPRITE('/vfx/slash', 50),
  pierce: SPRITE('/vfx/pierce', 48),
  whirl: SPRITE('/vfx/whirl', 52),
  heavy: SPRITE('/vfx/heavy', 52),
  impact: SPRITE('/vfx/impact', 55),
  fire: SPRITE('/vfx/fire', 55, 'center 72%'),
  heal: SPRITE('/vfx/heal', 60),
  shield: SPRITE('/vfx/shield', 55),
  smoke: SPRITE('/vfx/smoke', 62),
  mana: SPRITE('/vfx/mana', 58),
  'slash-ult': SPRITE('/vfx/slash-ult', 52),
  'pierce-ult': SPRITE('/vfx/pierce-ult', 50),
  'whirl-ult': SPRITE('/vfx/whirl-ult', 54),
  'heavy-ult': SPRITE('/vfx/heavy-ult', 54),
  'impact-ult': SPRITE('/vfx/impact-ult', 56),
  'fire-ult': SPRITE('/vfx/fire-ult', 56, 'center 70%'),
  'heal-ult': SPRITE('/vfx/heal-ult', 62),
  'shield-ult': SPRITE('/vfx/shield-ult', 56),
  'smoke-ult': SPRITE('/vfx/smoke-ult', 64),
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

/** 卡牌 → 人物动作（与特效标签联动） */
const TAG_ACTOR_ANIM = {
  slash: 'slash',
  pierce: 'thrust',
  whirl: 'slam',
  heavy: 'slam',
  impact: 'slam',
  fire: 'cast',
  heal: 'cast',
  mana: 'cast',
  smoke: 'cast',
  shield: 'guard',
}

export function getCardActorAnim(cardId) {
  const tags = getCardVfx(cardId).hero
  // 人物已画进特效帧时，不再叠 CSS 动作
  if (tags.some((tag) => getSpriteSpec(tag)?.actorClip)) return null
  for (const tag of tags) {
    if (TAG_ACTOR_ANIM[tag]) return TAG_ACTOR_ANIM[tag]
  }
  const tplHero = getCardVfx(cardId)
  if (tplHero.targets?.length) return 'slash'
  return 'cast'
}

export function cardUsesActorClip(cardId) {
  return getCardVfx(cardId).hero.some((tag) => getSpriteSpec(tag)?.actorClip)
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
