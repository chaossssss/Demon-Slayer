/** 卡牌中央插画路径（一星底图；二/三星沿用同图 + CSS 边框区分） */

import { publicAsset } from '@/utils/publicAsset'

const CARD_ART_PREFIX = '/assets/cards'

/** @type {Record<string, string>} */
export const CARD_ART = {
  slash: `${CARD_ART_PREFIX}/slash.png`,
  focus_strike: `${CARD_ART_PREFIX}/focus_strike.png`,
  whirlwind: `${CARD_ART_PREFIX}/whirlwind.png`,
  heavy_slash: `${CARD_ART_PREFIX}/heavy_slash.png`,
  guard: `${CARD_ART_PREFIX}/guard.png`,
  heal_potion: `${CARD_ART_PREFIX}/heal_potion.png`,
  ember: `${CARD_ART_PREFIX}/ember.png`,
  inferno: `${CARD_ART_PREFIX}/inferno.png`,
  ward: `${CARD_ART_PREFIX}/ward.png`,
  mana_surge: `${CARD_ART_PREFIX}/mana_surge.png`,
  stab: `${CARD_ART_PREFIX}/stab.png`,
  execute: `${CARD_ART_PREFIX}/execute.png`,
  smoke: `${CARD_ART_PREFIX}/smoke.png`,
  backstab: `${CARD_ART_PREFIX}/backstab.png`,
  bash: `${CARD_ART_PREFIX}/bash.png`,
  iron_wall: `${CARD_ART_PREFIX}/iron_wall.png`,
  riposte: `${CARD_ART_PREFIX}/riposte.png`,
  fortify: `${CARD_ART_PREFIX}/fortify.png`,
}

export function getCardArtUrl(cardId) {
  const url = CARD_ART[cardId]
  return url ? publicAsset(url) : null
}
