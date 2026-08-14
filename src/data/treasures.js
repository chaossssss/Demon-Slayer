/** 宝物等级与权重 */
export const TREASURE_TIERS = {
  common: { id: 'common', name: '凡品', color: '#5c6670', weight: 50 },
  uncommon: { id: 'uncommon', name: '灵品', color: '#3d6b4f', weight: 28 },
  rare: { id: 'rare', name: '宝器', color: '#8a6a12', weight: 14 },
  cursed: { id: 'cursed', name: '咒物', color: '#9b2d1f', weight: 8 },
}

/**
 * 宝物效果字段说明（可正可负）：
 * maxHp / goldPerTurn / maxEnergy
 * damageFlat / blockFlat / burnFlat / healFlat / thornsFlat
 * startBlock          回合开始获得护甲
 * turnStartGold       回合开始额外金币
 * turnStartHpLoss     回合开始失去生命
 * turnStartHpHeal     回合开始回复生命
 * damageTakenFlat     受到攻击时额外承伤
 * shopPriceFlat       商店价格加减
 * floorClearHeal      通关休整额外回血
 * lifesteal           造成伤害后按比例吸血（0~1）
 */
export const TREASURE_POOL = {
  copper_coin: {
    id: 'copper_coin',
    name: '通宝钱',
    tier: 'common',
    icon: '钱',
    desc: '每回合额外获得 3 金币。',
    effects: { turnStartGold: 3 },
  },
  wooden_amulet: {
    id: 'wooden_amulet',
    name: '桃木符',
    tier: 'common',
    icon: '符',
    desc: '回合开始获得 3 点护甲。',
    effects: { startBlock: 3 },
  },
  herb_pouch: {
    id: 'herb_pouch',
    name: '药草袋',
    tier: 'common',
    icon: '药',
    desc: '治疗量 +2；每层通关额外回复 4 生命。',
    effects: { healFlat: 2, floorClearHeal: 4 },
  },
  iron_ring: {
    id: 'iron_ring',
    name: '铁护环',
    tier: 'common',
    icon: '环',
    desc: '获得护甲时额外 +2。',
    effects: { blockFlat: 2 },
  },

  jade_pendant: {
    id: 'jade_pendant',
    name: '翠玉佩',
    tier: 'uncommon',
    icon: '玉',
    desc: '最大生命 +12，并立即回复等量生命。',
    effects: { maxHp: 12 },
  },
  sharpening_stone: {
    id: 'sharpening_stone',
    name: '砺刃石',
    tier: 'uncommon',
    icon: '砺',
    desc: '所有伤害 +3。',
    effects: { damageFlat: 3 },
  },
  spirit_lantern: {
    id: 'spirit_lantern',
    name: '引魂灯',
    tier: 'uncommon',
    icon: '灯',
    desc: '灼烧叠加量 +2；回合产金 +2。',
    effects: { burnFlat: 2, goldPerTurn: 2 },
  },
  market_seal: {
    id: 'market_seal',
    name: '市籍印',
    tier: 'uncommon',
    icon: '印',
    desc: '商店卡牌价格 -6。',
    effects: { shopPriceFlat: -6 },
  },

  dragon_scale: {
    id: 'dragon_scale',
    name: '龙鳞甲片',
    tier: 'rare',
    icon: '鳞',
    desc: '最大生命 +20，回合开始获得 5 护甲。',
    effects: { maxHp: 20, startBlock: 5 },
  },
  soul_blade: {
    id: 'soul_blade',
    name: '噬魂刃穗',
    tier: 'rare',
    icon: '穗',
    desc: '伤害 +5，造成伤害后回复 15% 生命。',
    effects: { damageFlat: 5, lifesteal: 0.15 },
  },
  thunder_bead: {
    id: 'thunder_bead',
    name: '雷纹珠',
    tier: 'rare',
    icon: '雷',
    desc: '最大能量 +1。',
    effects: { maxEnergy: 1 },
  },
  thorn_crown: {
    id: 'thorn_crown',
    name: '棘冠',
    tier: 'rare',
    icon: '冠',
    desc: '回合开始获得 4 反伤；护甲 +3。',
    effects: { thornsFlat: 4, blockFlat: 3 },
  },

  // —— 咒物：增益 + 负面 ——
  blood_talisman: {
    id: 'blood_talisman',
    name: '血祭符',
    tier: 'cursed',
    icon: '血',
    desc: '伤害 +6，但每回合开始失去 3 生命。',
    effects: { damageFlat: 6, turnStartHpLoss: 3 },
  },
  greed_mask: {
    id: 'greed_mask',
    name: '贪魔面',
    tier: 'cursed',
    icon: '面',
    desc: '回合产金 +8，商店价格 +10。',
    effects: { goldPerTurn: 8, shopPriceFlat: 10 },
  },
  glass_heart: {
    id: 'glass_heart',
    name: '琉璃心',
    tier: 'cursed',
    icon: '心',
    desc: '最大能量 +1，受到攻击额外承伤 3。',
    effects: { maxEnergy: 1, damageTakenFlat: 3 },
  },
  ash_censer: {
    id: 'ash_censer',
    name: '劫灰炉',
    tier: 'cursed',
    icon: '炉',
    desc: '灼烧 +4、伤害 +3，最大生命 -10。',
    effects: { burnFlat: 4, damageFlat: 3, maxHp: -10 },
  },
  void_mirror: {
    id: 'void_mirror',
    name: '空镜',
    tier: 'cursed',
    icon: '镜',
    desc: '回合开始回复 6 生命，护甲 -2（获得护甲时减少）。',
    effects: { turnStartHpHeal: 6, blockFlat: -2 },
  },
  war_drum: {
    id: 'war_drum',
    name: '催战鼓',
    tier: 'cursed',
    icon: '鼓',
    desc: '伤害 +8，回合产金 -3。',
    effects: { damageFlat: 8, goldPerTurn: -3 },
  },
}

export const TREASURE_OFFER_COUNT = 3

export function getTreasure(id) {
  return TREASURE_POOL[id] || null
}

export function summarizeEffects(effects = {}) {
  const lines = []
  const map = [
    ['maxHp', (v) => `最大生命 ${fmt(v)}`],
    ['maxEnergy', (v) => `最大能量 ${fmt(v)}`],
    ['goldPerTurn', (v) => `回合产金 ${fmt(v)}`],
    ['damageFlat', (v) => `伤害 ${fmt(v)}`],
    ['blockFlat', (v) => `护甲获取 ${fmt(v)}`],
    ['burnFlat', (v) => `灼烧 ${fmt(v)}`],
    ['healFlat', (v) => `治疗 ${fmt(v)}`],
    ['thornsFlat', (v) => `回合反伤 ${fmt(v)}`],
    ['startBlock', (v) => `回合初护甲 ${fmt(v)}`],
    ['turnStartGold', (v) => `回合初金币 ${fmt(v)}`],
    ['turnStartHpLoss', (v) => `回合初失去 ${v} 生命`],
    ['turnStartHpHeal', (v) => `回合初回复 ${v} 生命`],
    ['damageTakenFlat', (v) => `额外承伤 ${fmt(v)}`],
    ['shopPriceFlat', (v) => `商店价格 ${fmt(v)}`],
    ['floorClearHeal', (v) => `通关回血 ${fmt(v)}`],
    ['lifesteal', (v) => `吸血 ${Math.round(v * 100)}%`],
  ]
  for (const [key, fn] of map) {
    if (effects[key]) lines.push(fn(effects[key]))
  }
  return lines
}

function fmt(v) {
  return v > 0 ? `+${v}` : `${v}`
}

export function isMixedTreasure(treasure) {
  const e = treasure.effects || {}
  const pos = ['maxHp', 'maxEnergy', 'goldPerTurn', 'damageFlat', 'blockFlat', 'burnFlat', 'healFlat', 'thornsFlat', 'startBlock', 'turnStartGold', 'turnStartHpHeal', 'floorClearHeal', 'lifesteal', 'shopPriceFlat']
  const neg = ['turnStartHpLoss', 'damageTakenFlat']
  let hasPos = false
  let hasNeg = false
  for (const k of pos) {
    if (e[k] > 0) hasPos = true
    if (e[k] < 0) hasNeg = true
  }
  for (const k of neg) {
    if (e[k] > 0) hasNeg = true
  }
  if (e.shopPriceFlat > 0) hasNeg = true
  if (e.shopPriceFlat < 0) hasPos = true
  return hasPos && hasNeg
}

export function rollTreasureOffers(ownedIds = [], { elite = false, floor = 1 } = {}) {
  const owned = new Set(ownedIds)
  const pool = Object.values(TREASURE_POOL).filter((t) => !owned.has(t.id))
  if (!pool.length) return []

  const picks = []
  const used = new Set()
  const count = Math.min(TREASURE_OFFER_COUNT, pool.length)

  for (let i = 0; i < count; i++) {
    const candidates = pool.filter((t) => !used.has(t.id))
    if (!candidates.length) break
    const t = pickTreasureWeighted(candidates, { elite, floor })
    used.add(t.id)
    picks.push(t)
  }
  return picks
}

function pickTreasureWeighted(list, { elite, floor }) {
  const weights = list.map((t) => {
    let w = TREASURE_TIERS[t.tier]?.weight || 10
    if (elite) {
      if (t.tier === 'rare') w *= 1.8
      if (t.tier === 'cursed') w *= 1.6
      if (t.tier === 'common') w *= 0.7
    }
    if (floor >= 6 && t.tier === 'common') w *= 0.75
    if (floor >= 8 && (t.tier === 'rare' || t.tier === 'cursed')) w *= 1.35
    return w
  })
  const total = weights.reduce((a, b) => a + b, 0)
  let roll = Math.random() * total
  for (let i = 0; i < list.length; i++) {
    roll -= weights[i]
    if (roll <= 0) return list[i]
  }
  return list[list.length - 1]
}

export function aggregateTreasureEffects(treasures) {
  const out = {}
  for (const t of treasures) {
    for (const [k, v] of Object.entries(t.effects || {})) {
      out[k] = (out[k] || 0) + v
    }
  }
  return out
}
