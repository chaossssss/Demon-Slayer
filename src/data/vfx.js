/** 有序列帧素材时优先播帧；否则回退代码粒子 */
export const VFX_DURATION = {
  slash: 400,
  fire: 450,
  heal: 500,
  shield: 450,
  smoke: 480,
}

/** tag → 帧目录（public 下），帧数与每帧毫秒 */
export const VFX_SPRITE = {
  slash: {
    dir: '/vfx/slash',
    frames: 8,
    frameMs: 50,
    blend: 'screen',
  },
  fire: {
    dir: '/vfx/fire',
    frames: 8,
    frameMs: 55,
    blend: 'screen',
  },
  heal: {
    dir: '/vfx/heal',
    frames: 8,
    frameMs: 60,
    blend: 'screen',
  },
  shield: {
    dir: '/vfx/shield',
    frames: 8,
    frameMs: 55,
    blend: 'screen',
  },
  smoke: {
    dir: '/vfx/smoke',
    frames: 8,
    frameMs: 58,
    blend: 'screen',
  },
}

export function getSpriteSpec(tag) {
  return VFX_SPRITE[tag] || null
}

/**
 * 出牌特效：hero 叠在玩家身上，targets 叠在每个选中的敌人身上。
 * 三星大招仍用同一套，由播放器放大并闪金。
 */
export const CARD_VFX = {
  slash: { hero: ['slash'], targets: ['slash'] },
  focus_strike: { hero: ['slash'], targets: ['slash'] },
  whirlwind: { hero: ['slash'], targets: ['slash'] },
  heavy_slash: { hero: ['slash'], targets: ['slash'] },
  stab: { hero: ['slash'], targets: ['slash'] },
  execute: { hero: ['slash'], targets: ['slash'] },
  backstab: { hero: ['slash'], targets: ['slash'] },
  bash: { hero: ['shield'], targets: ['slash'] },
  ember: { hero: ['fire'], targets: ['fire'] },
  inferno: { hero: ['fire'], targets: ['fire'] },
  ward: { hero: ['shield', 'heal'], targets: ['fire'] },
  guard: { hero: ['shield'], targets: [] },
  iron_wall: { hero: ['shield'], targets: [] },
  riposte: { hero: ['shield'], targets: [] },
  fortify: { hero: ['shield'], targets: [] },
  heal_potion: { hero: ['heal'], targets: [] },
  smoke: { hero: ['smoke'], targets: [] },
  mana_surge: { hero: ['heal'], targets: [] },
}

export function getCardVfx(cardId) {
  return CARD_VFX[cardId] || { hero: [], targets: [] }
}

export function vfxPlayDuration(cardId, star = 1) {
  const spec = getCardVfx(cardId)
  const tags = [...spec.hero, ...spec.targets]
  const base = tags.reduce((max, tag) => {
    const sprite = getSpriteSpec(tag)
    const dur = sprite ? sprite.frames * sprite.frameMs : VFX_DURATION[tag] || 480
    return Math.max(max, dur)
  }, 420)
  return Number(star) >= 3 ? Math.round(base * 1.12) : base
}

export function vfxImpactDelay(cardId) {
  return getCardVfx(cardId).targets.length ? 110 : 0
}
