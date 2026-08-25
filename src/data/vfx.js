/** 可复用战斗特效标签（一张牌可以叠多个，不要一牌一条片子） */
export const VFX_DURATION = {
  slash: 680,
  fire: 980,
  heal: 1100,
  shield: 900,
  smoke: 1200,
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
  const base = tags.reduce((max, tag) => Math.max(max, VFX_DURATION[tag] || 480), 420)
  return Number(star) >= 3 ? Math.round(base * 1.12) : base
}

export function vfxImpactDelay(cardId) {
  return getCardVfx(cardId).targets.length ? 110 : 0
}
