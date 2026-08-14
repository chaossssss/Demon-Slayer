/** 职业配置：初始仅解锁剑士，其余靠通关进度解锁 */
export const CLASSES = {
  swordsman: {
    id: 'swordsman',
    name: '剑士',
    title: '破晓斩',
    desc: '均衡的近战职业，起步稳、伤害扎实。',
    color: '#c45c26',
    maxHp: 70,
    energy: 3,
    startGold: 50,
    goldPerTurn: 12,
    unlock: { type: 'default' }, // TODO: 测试完改回 floors/wins 解锁
    starterDeck: [
      { cardId: 'slash', count: 2 },
      { cardId: 'heal_potion', count: 1 },
      { cardId: 'guard', count: 2 },
    ],
  },
  mage: {
    id: 'mage',
    name: '咒术师',
    title: '炎符',
    desc: '高费高伤，擅长范围咒术与灼烧。',
    color: '#3d6b8c',
    maxHp: 55,
    energy: 3,
    startGold: 55,
    goldPerTurn: 14,
    unlock: { type: 'default' }, // TODO: 测试完改回 { type: 'floors', value: 5 }
    starterDeck: [
      { cardId: 'ember', count: 2 },
      { cardId: 'heal_potion', count: 1 },
      { cardId: 'ward', count: 2 },
    ],
  },
  assassin: {
    id: 'assassin',
    name: '影刃',
    title: '夜狩',
    desc: '脆皮爆发，击杀回能，速战速决。',
    color: '#5a3d6b',
    maxHp: 48,
    energy: 4,
    startGold: 60,
    goldPerTurn: 13,
    unlock: { type: 'default' }, // TODO: 测试完改回 { type: 'wins', value: 2 }
    starterDeck: [
      { cardId: 'stab', count: 2 },
      { cardId: 'heal_potion', count: 1 },
      { cardId: 'smoke', count: 2 },
    ],
  },
  guardian: {
    id: 'guardian',
    name: '御盾',
    title: '铁壁',
    desc: '厚血高防，以守待攻，反伤见长。',
    color: '#4a6b3d',
    maxHp: 90,
    energy: 3,
    startGold: 45,
    goldPerTurn: 11,
    unlock: { type: 'default' }, // TODO: 测试完改回 { type: 'wins', value: 4 }
    starterDeck: [
      { cardId: 'bash', count: 2 },
      { cardId: 'heal_potion', count: 1 },
      { cardId: 'iron_wall', count: 2 },
    ],
  },
}

/** 卡牌模板。星级叠加倍率；三星解锁专属大招 ultimate */
export const CARD_POOL = {
  slash: {
    id: 'slash',
    name: '斩击',
    type: 'attack',
    cost: 1,
    rarity: 'common',
    price: 18,
    classes: ['swordsman'],
    base: { damage: 8 },
    desc: (s) => `造成 ${s.damage} 点伤害`,
    ultimate: {
      name: '破军一闪',
      effect: { damage: 28, pierce: true },
      desc: (e) => `额外造成 ${e.damage} 点穿透伤害`,
    },
  },
  focus_strike: {
    id: 'focus_strike',
    name: '一心斩',
    type: 'attack',
    cost: 2,
    rarity: 'uncommon',
    price: 32,
    classes: ['swordsman'],
    base: { damage: 16 },
    desc: (s) => `造成 ${s.damage} 点伤害`,
    ultimate: {
      name: '无想剑',
      effect: { damage: 40, energy: 1, heal: 8, killHeal: 20 },
      desc: (e) =>
        `额外造成 ${e.damage} 点伤害，回复 ${e.energy} 能量与 ${e.heal} 生命；若以此击杀则改为回复 ${e.killHeal} 生命`,
    },
  },
  whirlwind: {
    id: 'whirlwind',
    name: '回旋刀',
    type: 'attack',
    cost: 1,
    rarity: 'uncommon',
    price: 28,
    classes: ['swordsman'],
    targetCount: 2,
    base: { damage: 5, hits: 2 },
    desc: (s) => `选择至多 2 名敌人，各造成 ${s.damage} 点伤害 ${s.hits} 次`,
    ultimate: {
      name: '千刃风暴',
      effect: { damage: 8, hits: 5 },
      desc: (e) => `对所选敌人各额外造成 ${e.damage} 点伤害 ${e.hits} 次`,
    },
  },
  guard: {
    id: 'guard',
    name: '格挡',
    type: 'skill',
    cost: 1,
    rarity: 'common',
    price: 16,
    classes: ['swordsman', 'mage', 'assassin', 'guardian'],
    base: { block: 6 },
    desc: (s) => `获得 ${s.block} 点护甲`,
    ultimate: {
      name: '金刚壁',
      effect: { block: 22, heal: 6 },
      desc: (e) => `额外获得 ${e.block} 护甲，回复 ${e.heal} 生命`,
    },
  },
  ember: {
    id: 'ember',
    name: '炎咒',
    type: 'attack',
    cost: 1,
    rarity: 'common',
    price: 18,
    classes: ['mage'],
    targetCount: 2,
    base: { damage: 7, burn: 2 },
    desc: (s) => `选择至多 2 名敌人，各造成 ${s.damage} 点伤害并施加 ${s.burn} 灼烧`,
    ultimate: {
      name: '赤莲咒',
      effect: { damage: 18, burn: 8 },
      desc: (e) => `对所选敌人各额外造成 ${e.damage} 点伤害，施加 ${e.burn} 灼烧`,
    },
  },
  inferno: {
    id: 'inferno',
    name: '业火',
    type: 'attack',
    cost: 2,
    rarity: 'rare',
    price: 40,
    classes: ['mage'],
    targetCount: 3,
    base: { damage: 12, burn: 4 },
    desc: (s) => `选择至多 3 名敌人，各造成 ${s.damage} 点伤害并施加 ${s.burn} 灼烧`,
    ultimate: {
      name: '焚天劫',
      effect: { damage: 32, burn: 12, pierce: true },
      desc: (e) => `对所选敌人各额外造成 ${e.damage} 点穿透伤害，施加 ${e.burn} 灼烧`,
    },
  },
  ward: {
    id: 'ward',
    name: '结界',
    type: 'skill',
    cost: 1,
    rarity: 'common',
    price: 17,
    classes: ['mage'],
    targetCount: 2,
    base: { block: 5, heal: 2, burn: 1 },
    desc: (s) => `获得 ${s.block} 护甲、回复 ${s.heal} 生命；选择至多 2 名敌人各施加 ${s.burn} 灼烧`,
    ultimate: {
      name: '灵域护持',
      effect: { block: 16, heal: 12, energy: 1, burn: 3 },
      desc: (e) => `额外获得 ${e.block} 护甲、回复 ${e.heal} 生命与 ${e.energy} 能量；对所选敌人各施加 ${e.burn} 灼烧`,
    },
  },
  mana_surge: {
    id: 'mana_surge',
    name: '灵涌',
    type: 'skill',
    cost: 0,
    rarity: 'uncommon',
    price: 30,
    classes: ['mage'],
    base: { energy: 2 },
    desc: (s) => `获得 ${s.energy} 点能量`,
    ultimate: {
      name: '咒源爆发',
      effect: { energy: 3, draw: 2, damage: 15 },
      desc: (e) => `额外获得 ${e.energy} 能量、抽 ${e.draw} 张牌，并造成 ${e.damage} 点伤害`,
    },
  },
  stab: {
    id: 'stab',
    name: '刺击',
    type: 'attack',
    cost: 1,
    rarity: 'common',
    price: 17,
    classes: ['assassin'],
    base: { damage: 9 },
    desc: (s) => `造成 ${s.damage} 点伤害`,
    ultimate: {
      name: '穿心刺',
      effect: { damage: 30, pierce: true, draw: 1 },
      desc: (e) => `额外造成 ${e.damage} 点穿透伤害，抽 ${e.draw} 张牌`,
    },
  },
  execute: {
    id: 'execute',
    name: '处决',
    type: 'attack',
    cost: 2,
    rarity: 'rare',
    price: 42,
    classes: ['assassin'],
    base: { damage: 14, executeBonus: 10 },
    desc: (s) => `造成 ${s.damage} 点伤害；目标低于半血时额外 ${s.executeBonus}`,
    ultimate: {
      name: '绝命裁断',
      effect: { damage: 36, executeBonus: 24, energy: 2 },
      desc: (e) => `额外造成 ${e.damage} 点；半血以下再加 ${e.executeBonus}，并回复 ${e.energy} 能量`,
    },
  },
  smoke: {
    id: 'smoke',
    name: '烟遁',
    type: 'skill',
    cost: 1,
    rarity: 'common',
    price: 18,
    classes: ['assassin'],
    base: { block: 4, draw: 1 },
    desc: (s) => `获得 ${s.block} 护甲，抽 ${s.draw} 张牌`,
    ultimate: {
      name: '影隐杀机',
      effect: { block: 14, draw: 2, weaken: 4 },
      desc: (e) => `额外获得 ${e.block} 护甲、抽 ${e.draw} 张牌，削弱敌人攻击 ${e.weaken}`,
    },
  },
  backstab: {
    id: 'backstab',
    name: '背刺',
    type: 'attack',
    cost: 0,
    rarity: 'uncommon',
    price: 34,
    classes: ['assassin'],
    base: { damage: 11 },
    desc: (s) => `造成 ${s.damage} 点伤害`,
    ultimate: {
      name: '夜狩终焉',
      effect: { damage: 34, pierce: true, heal: 8 },
      desc: (e) => `额外造成 ${e.damage} 点穿透伤害，回复 ${e.heal} 生命`,
    },
  },
  bash: {
    id: 'bash',
    name: '重击',
    type: 'attack',
    cost: 1,
    rarity: 'common',
    price: 18,
    classes: ['guardian'],
    targetCount: 2,
    base: { damage: 6, block: 3 },
    desc: (s) => `选择至多 2 名敌人各造成 ${s.damage} 点伤害，并获得 ${s.block} 护甲`,
    ultimate: {
      name: '震地锤',
      effect: { damage: 22, block: 12, weaken: 3 },
      desc: (e) => `对所选敌人各额外造成 ${e.damage} 点伤害并削弱 ${e.weaken}，获得 ${e.block} 护甲`,
    },
  },
  iron_wall: {
    id: 'iron_wall',
    name: '铁壁',
    type: 'skill',
    cost: 1,
    rarity: 'common',
    price: 18,
    classes: ['guardian'],
    base: { block: 10 },
    desc: (s) => `获得 ${s.block} 点护甲`,
    ultimate: {
      name: '不灭城垣',
      effect: { block: 30, thorns: 8 },
      desc: (e) => `额外获得 ${e.block} 护甲与 ${e.thorns} 反伤`,
    },
  },
  riposte: {
    id: 'riposte',
    name: '反击',
    type: 'skill',
    cost: 1,
    rarity: 'uncommon',
    price: 30,
    classes: ['guardian'],
    base: { block: 7, thorns: 4 },
    desc: (s) => `获得 ${s.block} 护甲与 ${s.thorns} 反伤`,
    ultimate: {
      name: '以守为攻',
      effect: { block: 18, thorns: 12, damage: 16 },
      desc: (e) => `额外获得 ${e.block} 护甲、${e.thorns} 反伤，并造成 ${e.damage} 点伤害`,
    },
  },
  fortify: {
    id: 'fortify',
    name: '固守',
    type: 'skill',
    cost: 2,
    rarity: 'rare',
    price: 38,
    classes: ['guardian'],
    base: { block: 18 },
    desc: (s) => `获得 ${s.block} 点护甲`,
    ultimate: {
      name: '天盾降临',
      effect: { block: 40, heal: 15, thorns: 6 },
      desc: (e) => `额外获得 ${e.block} 护甲、${e.thorns} 反伤，回复 ${e.heal} 生命`,
    },
  },
  heal_potion: {
    id: 'heal_potion',
    name: '疗伤散',
    type: 'skill',
    cost: 1,
    rarity: 'uncommon',
    price: 26,
    classes: ['swordsman', 'mage', 'assassin', 'guardian'],
    base: { heal: 8 },
    desc: (s) => `回复 ${s.heal} 点生命`,
    ultimate: {
      name: '回春秘剂',
      effect: { heal: 25, block: 10, energy: 1 },
      desc: (e) => `额外回复 ${e.heal} 生命、获得 ${e.block} 护甲与 ${e.energy} 能量`,
    },
  },
  heavy_slash: {
    id: 'heavy_slash',
    name: '裂空',
    type: 'attack',
    cost: 2,
    rarity: 'rare',
    price: 44,
    classes: ['swordsman'],
    base: { damage: 22 },
    desc: (s) => `造成 ${s.damage} 点伤害`,
    ultimate: {
      name: '天裂斩',
      effect: { damage: 48, pierce: true, block: 8 },
      desc: (e) => `额外造成 ${e.damage} 点穿透伤害，获得 ${e.block} 护甲`,
    },
  },
}

export const STAR_MULT = {
  1: 1,
  2: 1.75,
  3: 2.75,
}

export const RARITY_WEIGHT = {
  common: 60,
  uncommon: 30,
  rare: 10,
}

export const ENEMY_TEMPLATES = [
  { id: 'imp', name: '小鬼', hp: 28, damage: 6, intent: 'attack' },
  { id: 'hound', name: '血犬', hp: 34, damage: 8, intent: 'attack' },
  { id: 'brute', name: '蛮鬼', hp: 48, damage: 10, intent: 'attack', blockChance: 0.3 },
  { id: 'shaman', name: '咒鬼', hp: 36, damage: 7, intent: 'burn', burn: 3 },
  { id: 'elite', name: '鬼将', hp: 70, damage: 14, intent: 'attack', elite: true },
  { id: 'boss', name: '百目鬼王', hp: 120, damage: 16, intent: 'boss', elite: true, boss: true },
]

export const MAX_STAR = 3
export const MERGE_COUNT = 3
export const HAND_SIZE = 10
/** 每回合开始从牌堆获得的一星卡数量 */
export const TURN_START_STAR1_CARDS = 2
/** 第 1 层开局发放的一星卡数量 */
export const FLOOR1_START_STAR1_CARDS = 5
export const SHOP_SIZE = 3
export const FLOORS_TO_WIN = 10

/** 多怪层：层数 → 敌人数量 */
export const MULTI_ENEMY_FLOORS = {
  3: 2,
  5: 3,
  6: 2,
  7: 3,
}

/** 卡牌需要点选的敌人数；未配置时：有伤害/灼烧/削弱则默认 1，否则 0 */
export function getCardTargetCount(template) {
  if (!template) return 0
  if (template.targetCount != null) return template.targetCount
  const b = template.base || {}
  if (b.damage || b.burn || b.weaken || b.executeBonus) return 1
  return 0
}

export function scaleStats(base, star) {
  const m = STAR_MULT[star] || 1
  const out = {}
  if (!base) return out
  for (const [k, v] of Object.entries(base)) {
    out[k] = Math.round(v * m)
  }
  return out
}

export function getUltimate(template) {
  return template?.ultimate || null
}

export function getCardDesc(template, star) {
  if (!template?.base || typeof template.desc !== 'function') return ''
  const stats = scaleStats(template.base, star)
  let text = template.desc(stats)
  const ult = template.ultimate
  if (star >= MAX_STAR && ult?.effect && typeof ult.desc === 'function') {
    text += `。【大招·${ult.name}】${ult.desc(ult.effect)}`
  } else if (ult?.name) {
    text += `（★★★解锁大招「${ult.name}」）`
  }
  return text
}
