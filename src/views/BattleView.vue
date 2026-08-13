<template>
  <main class="view battle" v-if="ready">
    <StatusBar
      :class-name="game.classInfo.name"
      :class-color="game.classInfo.color"
      :floor="game.floor"
      :turn="game.turn"
      :hp="game.hp"
      :max-hp="game.maxHp"
      :block="game.block"
      :gold="game.gold"
      :gold-per-turn="incomePreview"
      :energy="game.energy"
      :max-energy="game.maxEnergy"
      :deck-count="game.deck.length"
    />

    <div class="arena">
      <section class="enemy-zone panel">
        <div v-if="game.enemy && game.phase !== 'victory'" class="enemy">
          <div class="enemy-badge" :class="{ elite: game.enemy.elite, boss: game.enemy.boss }">
            {{ game.enemy.boss ? 'BOSS' : game.enemy.elite ? '精英' : '妖鬼' }}
          </div>
          <h2>{{ game.enemy.name }}</h2>
          <div class="intent">意图：攻击 {{ intentDamage }}</div>
          <div class="meter">
            <div class="meter-label">
              <span>生命</span>
              <span>{{ game.enemy.hp }} / {{ game.enemy.maxHp }}</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill hp" :style="{ width: enemyHpPct + '%' }" />
            </div>
          </div>
          <p v-if="game.enemy.burnStacks" class="burn">灼烧 {{ game.enemy.burnStacks }}</p>
          <p v-if="game.enemy.block" class="enemy-block">护甲 {{ game.enemy.block }}</p>
        </div>
        <div v-else class="rest">
          <h2>{{ game.phase === 'victory' ? '胜利' : '层间休整' }}</h2>
          <p>{{ game.phase === 'victory' ? '十层鬼域已平定。' : '补充卡组，准备下一层。' }}</p>
        </div>
      </section>

      <ShopPanel
        :shop="game.shop"
        :gold="game.gold"
        :reroll-cost="rerollCost"
        :locked="game.phase === 'victory' || game.phase === 'defeat'"
        @buy="game.buyCard"
        @reroll="game.rerollShop"
        @merge="game.toggleMergePanel(true)"
      />

      <aside class="log panel">
        <h3>战报</h3>
        <ul>
          <li v-for="item in game.log" :key="item.id">{{ item.msg }}</li>
        </ul>
      </aside>
    </div>

    <section class="hand-dock" v-if="game.phase === 'combat'">
      <div class="hand">
        <GameCard
          v-for="card in handCards"
          :key="card.uid"
          :card="card"
          :playable="game.canPlay(card)"
          :disabled="!game.canPlay(card)"
          @select="game.playCard(card.uid)"
        />
      </div>
      <button class="btn btn-primary end-turn" @click="game.endTurn">结束回合</button>
    </section>

    <section class="between" v-else-if="game.phase === 'shop'">
      <p>可继续购买卡牌并合成，准备妥当后进入下一层。</p>
      <button class="btn btn-primary" @click="game.nextFloor">前往第 {{ game.floor + 1 }} 层</button>
    </section>

    <div v-if="game.phase === 'victory' || game.phase === 'defeat'" class="result-overlay">
      <div class="result panel fade-up">
        <h2>{{ game.phase === 'victory' ? '凯旋' : '陨落' }}</h2>
        <p>
          {{
            game.phase === 'victory'
              ? '你以一人之力斩尽鬼域。新的职业或许已经解锁。'
              : `你在第 ${game.floor} 层倒下。再试一次，积攒解锁进度。`
          }}
        </p>
        <div class="result-actions">
          <RouterLink class="btn btn-primary" to="/class">再选职业</RouterLink>
          <RouterLink class="btn btn-ghost dark" to="/">返回首页</RouterLink>
        </div>
      </div>
    </div>

    <MergeModal
      v-if="game.showMerge"
      :groups="game.mergeGroups"
      :deck="game.deck"
      @close="game.toggleMergePanel(false)"
      @merge="onMerge"
    />
  </main>

  <main v-else class="view battle">
    <p class="fallback">尚未开始征途，<RouterLink to="/class">选择职业</RouterLink></p>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import StatusBar from '@/components/StatusBar.vue'
import ShopPanel from '@/components/ShopPanel.vue'
import GameCard from '@/components/GameCard.vue'
import MergeModal from '@/components/MergeModal.vue'
import { getCardDesc, CARD_POOL } from '@/data/gameData'

const game = useGameStore()
const { classId, floor, goldPerTurn } = storeToRefs(game)

const ready = computed(() => !!classId.value)

const incomePreview = computed(
  () => goldPerTurn.value + Math.floor((floor.value - 1) / 2) * 2,
)

const rerollCost = computed(() => 8 + floor.value)

const enemyHpPct = computed(() => {
  if (!game.enemy) return 0
  return Math.max(0, Math.min(100, (game.enemy.hp / game.enemy.maxHp) * 100))
})

const intentDamage = computed(() => {
  if (!game.enemy) return 0
  let dmg = game.enemy.damage
  if (game.enemy.intent === 'boss' && game.turn % 3 === 0) dmg = Math.round(dmg * 1.4)
  return dmg
})

const handCards = computed(() =>
  game.hand.map((c) => ({
    ...c,
    desc: getCardDesc(CARD_POOL[c.cardId], c.star),
  })),
)

function onMerge(cardId, star) {
  game.manualMerge(cardId, star)
}
</script>

<style scoped>
.battle {
  max-width: 1280px;
  margin: 0 auto;
  padding-bottom: 160px;
}

.arena {
  display: grid;
  grid-template-columns: 1.1fr 1.2fr 0.8fr;
  gap: 16px;
  margin-top: 16px;
}

.enemy-zone,
.log {
  padding: 20px;
  min-height: 320px;
}

.enemy h2,
.rest h2 {
  margin: 8px 0 10px;
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  font-size: 1.8rem;
}

.enemy-badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  background: var(--ink);
  color: var(--paper);
}

.enemy-badge.elite {
  background: #6b4f1f;
}

.enemy-badge.boss {
  background: var(--blood);
  animation: pulseSoft 1.6s ease infinite;
}

.intent {
  margin-bottom: 14px;
  color: var(--ink-soft);
}

.meter-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.burn {
  color: var(--ember);
}

.enemy-block {
  color: #2a4a6b;
}

.log h3 {
  margin: 0 0 10px;
  font-family: var(--font-display);
  letter-spacing: 0.1em;
}

.log ul {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 280px;
  overflow: auto;
}

.log li {
  padding: 8px 0;
  border-bottom: 1px dashed var(--line);
  color: var(--ink-soft);
  font-size: 0.92rem;
  line-height: 1.4;
}

.hand-dock {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 18px;
  padding: 18px 24px 22px;
  background: linear-gradient(180deg, transparent, rgba(12, 8, 5, 0.88) 35%);
}

.hand {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.end-turn {
  align-self: center;
  min-width: 140px;
}

.between {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  color: var(--paper);
}

.result-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgba(10, 7, 4, 0.78);
  padding: 24px;
}

.result {
  width: min(440px, 100%);
  padding: 28px;
  text-align: center;
}

.result h2 {
  margin: 0 0 10px;
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.16em;
}

.result p {
  color: var(--ink-soft);
  line-height: 1.6;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.btn-ghost.dark {
  color: var(--ink);
  border-color: rgba(28, 23, 18, 0.3);
  background: rgba(28, 23, 18, 0.06);
}

.fallback {
  color: var(--paper);
  margin-top: 20vh;
  text-align: center;
}

.fallback a {
  color: var(--ember);
}

@media (max-width: 1100px) {
  .arena {
    grid-template-columns: 1fr;
  }
}
</style>
