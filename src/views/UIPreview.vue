<template>
  <div class="app-shell">
    <div class="atmosphere"></div>

    <nav class="preview-nav">
      <div class="nav-inner">
        <span class="nav-title">斩鬼录 · UI 效果图</span>
        <div class="nav-links">
          <a
            v-for="(s, i) in sections"
            :key="i"
            :href="'#' + s.id"
            @click.prevent="scrollTo(s.id)"
            :class="{ active: active === s.id }"
          >
            {{ s.name }}
          </a>
        </div>
        <RouterLink class="btn btn-ghost nav-back" to="/"
          >← 返回游戏</RouterLink
        >
      </div>
    </nav>

    <main class="view preview">
      <!-- 1. 首页 -->
      <section id="home" class="preview-section fade-up">
        <div class="section-label">01 · 首页 Home</div>
        <div class="section-body home-mock panel">
          <div class="home-left">
            <p class="eyebrow">PC · 回合制卡牌</p>
            <h1 class="brand title-xl">斩鬼录</h1>
            <p class="tagline">购卡、合成、出招——在十层鬼域中杀出一条生路。</p>
            <div class="cta">
              <button class="btn btn-primary">开始征途</button>
            </div>
            <ul class="stats">
              <li>通关 <strong>3</strong> 次</li>
              <li>最高抵达第 <strong>10</strong> 层</li>
              <li>已解锁 <strong>4</strong> 个职业</li>
            </ul>
          </div>
          <aside class="rules-side">
            <h2>核心规则</h2>
            <ol>
              <li>
                初始仅解锁<strong>剑士</strong>，通关与推进层数可解锁更多职业。
              </li>
              <li>每回合自动获得金币，并刷新 3 张可购卡牌。</li>
              <li>同名同星卡牌集齐 3 张可合成升星，最高 3 星。</li>
              <li>打出卡牌消耗能量；结束回合后敌人行动。</li>
            </ol>
          </aside>
        </div>
      </section>

      <!-- 2. 职业选择 -->
      <section id="class" class="preview-section fade-up">
        <div class="section-label">02 · 职业选择 Class Select</div>
        <div class="section-body class-mock panel">
          <header class="top-mock">
            <span class="back">← 返回</span>
            <h1 class="brand">选择职业</h1>
            <p>最初只有剑士可出征，其余职业随战绩解锁。</p>
          </header>
          <div class="grid-mock">
            <div
              v-for="(c, i) in mockClasses"
              :key="c.id"
              class="class-card-mock"
              :class="{ locked: !c.unlocked, selected: c.selected }"
              :style="{ '--accent': c.color }"
            >
              <div
                class="portrait"
                :style="{
                  background: `linear-gradient(135deg, ${c.color}55, #1c1712)`,
                }"
              >
                <span class="portrait-placeholder">{{ c.placeholder }}</span>
              </div>
              <div class="mark"></div>
              <h2>{{ c.name }}</h2>
              <p class="title">{{ c.title }}</p>
              <p class="desc">{{ c.desc }}</p>
              <ul>
                <li>生命 {{ c.maxHp }}</li>
                <li>能量 {{ c.energy }}</li>
                <li>起步金 {{ c.startGold }}</li>
                <li>每回合 +{{ c.goldPerTurn }}</li>
              </ul>
              <div v-if="!c.unlocked" class="lock">
                <span class="lock-icon">🔒</span>
                {{ c.unlockHint }}
              </div>
            </div>
          </div>
          <div class="footer-mock">
            <button class="btn btn-primary">踏入鬼域</button>
          </div>
        </div>
      </section>

      <!-- 3. 战斗界面 -->
      <section id="battle" class="preview-section fade-up">
        <div class="section-label">03 · 战斗界面 Battle</div>
        <div class="section-body battle-mock">
          <div class="hud-mock panel">
            <div class="identity">
              <span class="class-name" style="color: #c45c26">剑士</span>
              <span class="meta">第 7 层 · 回合 3</span>
            </div>
            <div class="meters">
              <div class="meter">
                <div class="meter-label">
                  <span>生命</span>
                  <span>52 / 70（护甲 12）</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill hp" style="width: 74%"></div>
                </div>
              </div>
            </div>
            <div class="resources">
              <div class="chip gold">
                <span class="icon">金</span><strong>128</strong
                ><small>+18/回合</small>
              </div>
              <div class="chip energy">
                <span class="icon">能</span><strong>2 / 3</strong>
              </div>
              <div class="chip deck">
                <span class="icon">牌</span><strong>24</strong>
              </div>
            </div>
          </div>

          <div class="arena-mock">
            <div class="enemy-zone panel">
              <div class="enemy">
                <div class="enemy-portrait elite-portrait">
                  <span class="portrait-placeholder">鬼 将</span>
                </div>
                <div class="enemy-badge elite">精英</div>
                <h2>鬼将</h2>
                <div class="intent">
                  <span class="intent-icon">⚔</span>
                  意图：攻击 <strong>22</strong>
                </div>
                <div class="meter">
                  <div class="meter-label">
                    <span>生命</span>
                    <span>86 / 142</span>
                  </div>
                  <div class="bar-track">
                    <div class="bar-fill hp" style="width: 60%"></div>
                  </div>
                </div>
                <div class="status-row">
                  <span class="burn-tag">🔥 灼烧 5</span>
                  <span class="block-tag">🛡 护甲 8</span>
                </div>
              </div>
            </div>

            <div class="shop-mock panel">
              <header>
                <h2>卡牌市集</h2>
                <p>每回合自动刷新 · 三张同名同星可合成升星</p>
              </header>
              <div class="offers">
                <div
                  v-for="(card, i) in shopCards"
                  :key="i"
                  class="card"
                  :class="[
                    `type-${card.type}`,
                    `rarity-${card.rarity}`,
                    { ultimate: card.ult },
                  ]"
                >
                  <div class="card-top">
                    <span class="cost">{{ card.cost }}</span>
                    <span class="stars">{{ "★".repeat(card.star) }}</span>
                  </div>
                  <div v-if="card.ult" class="ult-badge">大招</div>
                  <h3 class="name">{{ card.name }}</h3>
                  <p v-if="card.ult" class="ult-name">{{ card.ultName }}</p>
                  <p class="desc">{{ card.desc }}</p>
                  <div class="card-foot">
                    <span class="type-label">{{ card.typeLabel }}</span>
                    <span class="price">{{ card.price }}金</span>
                  </div>
                </div>
              </div>
              <div class="actions">
                <button class="btn btn-ghost dark">刷新（15金）</button>
                <button class="btn btn-ghost dark">合成一览</button>
              </div>
            </div>

            <aside class="log panel">
              <h3>战报</h3>
              <ul>
                <li><strong>回合 3：</strong>获得 18 金币。</li>
                <li>卡牌市集已刷新 3 张新卡。</li>
                <li>打出「一心斩 ★★」造成 28 伤害。</li>
                <li>购入「裂空」(-44金)，加入手牌。</li>
                <li>敌人意图：攻击 22。</li>
                <li>灼烧对敌人造成 5 点伤害。</li>
                <li><strong>回合 2：</strong>获得 18 金币。</li>
              </ul>
            </aside>
          </div>

          <div class="hand-dock-mock">
            <div class="hand-mock">
              <div
                v-for="(card, i) in handCards"
                :key="'h' + i"
                class="card"
                :class="[
                  `type-${card.type}`,
                  `rarity-${card.rarity}`,
                  { playable: card.playable, ultimate: card.ult },
                ]"
                :style="{
                  transform: `rotate(${(i - 2) * 3}deg) translateY(${
                    Math.abs(i - 2) * 6
                  }px)`,
                }"
              >
                <div class="card-top">
                  <span class="cost">{{ card.cost }}</span>
                  <span class="stars">{{ "★".repeat(card.star) }}</span>
                </div>
                <div v-if="card.ult" class="ult-badge">大招</div>
                <h3 class="name">{{ card.name }}</h3>
                <p v-if="card.ult" class="ult-name">{{ card.ultName }}</p>
                <p class="desc">{{ card.desc }}</p>
                <div class="card-foot">
                  <span class="type-label">{{ card.typeLabel }}</span>
                </div>
              </div>
            </div>
            <button class="btn btn-primary end-turn">结束回合</button>
          </div>
        </div>
      </section>

      <!-- 4. 卡牌图鉴 -->
      <section id="cards" class="preview-section fade-up">
        <div class="section-label">04 · 卡牌样式 Cards (16种 × 3星 = 48张)</div>
        <div class="section-body cards-mock">
          <div class="cards-group">
            <h3 class="group-title">
              <span class="swatch attack"></span>攻击牌 · 普通 ★
            </h3>
            <div class="cards-row">
              <div
                v-for="c in cardsAttack1"
                :key="c.name"
                class="card type-attack"
              >
                <div class="card-top">
                  <span class="cost">{{ c.cost }}</span
                  ><span class="stars">★</span>
                </div>
                <h3 class="name">{{ c.name }}</h3>
                <p class="desc">{{ c.desc }}</p>
                <div class="card-foot">
                  <span class="type-label">攻击</span
                  ><span class="price">{{ c.price }}金</span>
                </div>
              </div>
            </div>
          </div>
          <div class="cards-group">
            <h3 class="group-title">
              <span class="swatch attack"></span>攻击牌 · 优秀 ★★
            </h3>
            <div class="cards-row">
              <div
                v-for="c in cardsAttack2"
                :key="c.name"
                class="card type-attack rarity-uncommon"
              >
                <div class="card-top">
                  <span class="cost">{{ c.cost }}</span
                  ><span class="stars">★★</span>
                </div>
                <h3 class="name">{{ c.name }}</h3>
                <p class="desc">{{ c.desc }}</p>
                <div class="card-foot">
                  <span class="type-label">攻击</span
                  ><span class="price">{{ c.price }}金</span>
                </div>
              </div>
            </div>
          </div>
          <div class="cards-group">
            <h3 class="group-title">
              <span class="swatch gold"></span>攻击牌 · 三星大招 ★★★
            </h3>
            <div class="cards-row">
              <div
                v-for="c in cardsAttack3"
                :key="c.name"
                class="card type-attack rarity-rare ultimate"
              >
                <div class="card-top">
                  <span class="cost">{{ c.cost }}</span
                  ><span class="stars">★★★</span>
                </div>
                <div class="ult-badge">大招</div>
                <h3 class="name">{{ c.name }}</h3>
                <p class="ult-name">{{ c.ultName }}</p>
                <p class="desc">{{ c.desc }}</p>
                <div class="card-foot">
                  <span class="type-label">大招</span
                  ><span class="price">{{ c.price }}金</span>
                </div>
              </div>
            </div>
          </div>
          <div class="cards-group">
            <h3 class="group-title">
              <span class="swatch skill"></span>技能牌 · 普通 / 优秀
            </h3>
            <div class="cards-row">
              <div
                v-for="c in cardsSkill"
                :key="c.name"
                class="card type-skill"
                :class="[
                  c.rarity === 'uncommon' ? 'rarity-uncommon' : '',
                  c.rarity === 'rare' ? 'rarity-rare' : '',
                ]"
              >
                <div class="card-top">
                  <span class="cost">{{ c.cost }}</span
                  ><span class="stars">★</span>
                </div>
                <h3 class="name">{{ c.name }}</h3>
                <p class="desc">{{ c.desc }}</p>
                <div class="card-foot">
                  <span class="type-label">技能</span
                  ><span class="price">{{ c.price }}金</span>
                </div>
              </div>
            </div>
          </div>
          <div class="cards-group">
            <h3 class="group-title">
              <span class="swatch gold"></span>技能牌 · 三星大招 ★★★
            </h3>
            <div class="cards-row">
              <div
                v-for="c in cardsSkill3"
                :key="c.name"
                class="card type-skill rarity-rare ultimate"
              >
                <div class="card-top">
                  <span class="cost">{{ c.cost }}</span
                  ><span class="stars">★★★</span>
                </div>
                <div class="ult-badge">大招</div>
                <h3 class="name">{{ c.name }}</h3>
                <p class="ult-name">{{ c.ultName }}</p>
                <p class="desc">{{ c.desc }}</p>
                <div class="card-foot">
                  <span class="type-label">大招</span
                  ><span class="price">{{ c.price }}金</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. 敌人图鉴 -->
      <section id="enemies" class="preview-section fade-up">
        <div class="section-label">05 · 敌人立绘 Enemies (6种)</div>
        <div class="section-body enemies-mock panel">
          <div
            v-for="e in enemies"
            :key="e.id"
            class="enemy-card"
            :class="{ elite: e.elite, boss: e.boss }"
          >
            <div class="enemy-portrait-mock" :style="{ background: e.bg }">
              <span class="portrait-placeholder">{{ e.placeholder }}</span>
            </div>
            <div class="enemy-badge" :class="{ elite: e.elite, boss: e.boss }">
              {{ e.boss ? "BOSS" : e.elite ? "精英" : "妖鬼" }}
            </div>
            <h4>{{ e.name }}</h4>
            <div class="enemy-stats">
              <span>HP {{ e.hp }}</span>
              <span>ATK {{ e.damage }}</span>
            </div>
            <p class="enemy-note">{{ e.note }}</p>
          </div>
        </div>
      </section>

      <!-- 6. 合成面板 & 胜负结算 -->
      <section id="modals" class="preview-section fade-up">
        <div class="section-label">06 · 弹窗模块 Modals</div>
        <div class="modals-grid">
          <div class="modal-wrap">
            <h3 class="modal-title">合成一览 MergeModal</h3>
            <div class="modal-bg">
              <div class="modal panel">
                <header>
                  <h2>卡组合成</h2>
                  <span class="close">×</span>
                </header>
                <p class="hint">
                  收集 <strong>3 张同名同星</strong> 可合成更高星（最高 3
                  星）。<strong>三星卡解锁专属大招</strong>。
                </p>
                <div class="groups">
                  <div class="group ready">
                    <div class="info">
                      <strong>★★ 斩击</strong>
                      <span class="count full">3 / 3</span>
                    </div>
                    <button class="btn btn-primary">合成 → ★★★</button>
                  </div>
                  <div class="group">
                    <div class="info">
                      <strong>★ 一心斩</strong>
                      <span class="count">2 / 3</span>
                    </div>
                    <button class="btn btn-primary" disabled>合成 → ★★</button>
                  </div>
                  <div class="group">
                    <div class="info">
                      <strong>★ 格挡</strong>
                      <span class="count full">3 / 3</span>
                      <span class="extra">（另有 1 张可继续合成）</span>
                    </div>
                    <button class="btn btn-primary">合成 → ★★</button>
                  </div>
                </div>
                <div class="deck-list">
                  <h3>当前卡组（18）</h3>
                  <ul>
                    <li>
                      <span class="stars">★★★</span> 斩击
                      <span class="ult-tag">大招·破军一闪</span>
                    </li>
                    <li><span class="stars">★★</span> 一心斩</li>
                    <li><span class="stars">★★</span> 格挡</li>
                    <li><span class="stars">★</span> 回旋刀</li>
                    <li><span class="stars">★</span> 疗伤散</li>
                    <li>
                      <span class="stars">★★★</span> 裂空
                      <span class="ult-tag">大招·天裂斩</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-wrap">
            <h3 class="modal-title">胜利结算 Victory</h3>
            <div class="modal-bg result-bg-win">
              <div class="modal panel result-panel-win">
                <h2 class="result-win-title">凯旋</h2>
                <div class="result-seal-win">勝</div>
                <p>你以一人之力斩尽鬼域。<br />咒术师已解锁！</p>
                <div class="result-stats">
                  <div><span>通关层数</span><strong>10 / 10</strong></div>
                  <div><span>总回合</span><strong>47</strong></div>
                  <div><span>最终卡组</span><strong>26 张</strong></div>
                </div>
                <div class="result-actions">
                  <button class="btn btn-primary">再选职业</button>
                  <button class="btn btn-ghost dark">返回首页</button>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-wrap">
            <h3 class="modal-title">失败结算 Defeat</h3>
            <div class="modal-bg result-bg-lose">
              <div class="modal panel result-panel-lose">
                <h2 class="result-lose-title">陨落</h2>
                <div class="result-seal-lose">隕</div>
                <p>你在第 7 层被鬼将击败。<br />再试一次，积攒解锁进度。</p>
                <div class="result-stats">
                  <div><span>抵达层数</span><strong>7 / 10</strong></div>
                  <div><span>历史最高</span><strong>9</strong></div>
                  <div><span>累计通关</span><strong>2 次</strong></div>
                </div>
                <div class="result-actions">
                  <button class="btn btn-primary">再选职业</button>
                  <button class="btn btn-ghost dark">返回首页</button>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-wrap">
            <h3 class="modal-title">Toast 提示</h3>
            <div class="modal-bg toast-bg">
              <div class="merge-toast-demo">
                ✨ 合成成功！★★★斩击 解锁大招「破军一闪」
              </div>
              <div class="merge-toast-demo alt">
                购入「裂空」(-44金)，加入手牌。
              </div>
              <div class="merge-toast-demo ult">💥 触发大招「天裂斩」！</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. 色板 & 图标 & 设计规范 -->
      <section id="spec" class="preview-section fade-up">
        <div class="section-label">07 · 设计规范 Design Spec</div>
        <div class="spec-grid">
          <div class="spec-card panel">
            <h3>🎨 色板 Tokens</h3>
            <div class="color-row">
              <div
                class="swatch-xl"
                style="background: linear-gradient(180deg, #2a2118, #1c1712)"
              >
                <span>炭黑底</span><code>#1c1712 ~ #2a2118</code>
              </div>
              <div
                class="swatch-xl"
                style="
                  background: linear-gradient(180deg, #d9cbb3, #c4b396);
                  color: #1c1712;
                "
              >
                <span>宣纸面板</span><code>#d9cbb3 / #c4b396</code>
              </div>
              <div class="swatch-xl" style="background: #9b2d1f">
                <span>血朱（主按钮/大招）</span><code>#9b2d1f</code>
              </div>
              <div class="swatch-xl" style="background: #c45c26">
                <span>烬橙（剑士/强调）</span><code>#c45c26</code>
              </div>
              <div
                class="swatch-xl"
                style="background: #c9a227; color: #1c1712"
              >
                <span>鎏金（三星/金币）</span><code>#c9a227</code>
              </div>
              <div class="swatch-xl" style="background: #3d6b8c">
                <span>青蓝（咒术师）</span><code>#3d6b8c</code>
              </div>
              <div class="swatch-xl" style="background: #5a3d6b">
                <span>紫影（影刃）</span><code>#5a3d6b</code>
              </div>
              <div class="swatch-xl" style="background: #4a6b3d">
                <span>苍绿（御盾）</span><code>#4a6b3d</code>
              </div>
            </div>
          </div>

          <div class="spec-card panel">
            <h3>🔤 字体 Typography</h3>
            <div class="type-sample">
              <p class="type-display">Noto Serif SC · 斩鬼录 · 标题</p>
              <p class="type-body">
                ZCOOL XiaoWei · 购卡、合成、出招——正文示例文字
              </p>
              <p
                class="type-huge"
                style="font-family: var(--font-display); color: var(--paper)"
              >
                斩·鬼·录
              </p>
            </div>
          </div>

          <div class="spec-card panel">
            <h3>🪙 图标小元素 Icons & Badges</h3>
            <div class="icon-grid">
              <div class="icon-chip hp"><span>❤</span><em>生命</em></div>
              <div class="icon-chip block"><span>🛡</span><em>护甲</em></div>
              <div class="icon-chip gold"><span>金</span><em>金币</em></div>
              <div class="icon-chip energy"><span>能</span><em>能量</em></div>
              <div class="icon-chip burn"><span>🔥</span><em>灼烧</em></div>
              <div class="icon-chip thorns"><span>🌵</span><em>反伤</em></div>
              <div class="icon-chip weaken"><span>↓</span><em>削弱</em></div>
              <div class="icon-chip pierce"><span>⇶</span><em>穿透</em></div>
              <div class="icon-chip deck"><span>牌</span><em>卡组</em></div>
              <div class="icon-chip refresh"><span>↻</span><em>刷新</em></div>
              <div class="icon-chip merge"><span>★↗</span><em>合成</em></div>
              <div class="icon-chip lock"><span>🔒</span><em>锁定</em></div>
            </div>
            <div class="badge-row" style="margin-top: 16px">
              <span class="badge-demo">妖鬼</span>
              <span class="badge-demo elite">精英</span>
              <span class="badge-demo boss">BOSS</span>
              <span class="badge-demo star">★★★</span>
              <span class="badge-demo ult">大招</span>
            </div>
          </div>

          <div class="spec-card panel">
            <h3>🧭 按钮 Buttons</h3>
            <div class="btn-row">
              <button class="btn btn-primary">开始征途</button>
              <button class="btn btn-primary" disabled>不可用</button>
              <button class="btn btn-ghost">次级按钮</button>
              <button class="btn btn-ghost dark">暗色幽灵</button>
            </div>
            <h3 style="margin-top: 20px">📊 进度条 Bars</h3>
            <div class="bars-demo">
              <div class="bar-track">
                <div class="bar-fill hp" style="width: 74%"></div>
              </div>
              <div class="bar-track">
                <div class="bar-fill block" style="width: 42%"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer class="preview-foot">
        <p>斩鬼录 · Demon Slayer UI 效果图一览 · 主题：和风暗色纸本</p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

const sections = [
  { id: "home", name: "首页" },
  { id: "class", name: "职业" },
  { id: "battle", name: "战斗" },
  { id: "cards", name: "卡牌" },
  { id: "enemies", name: "敌人" },
  { id: "modals", name: "弹窗" },
  { id: "spec", name: "规范" },
];
const active = ref("home");

const mockClasses = [
  {
    id: "swordsman",
    name: "剑士",
    title: "破晓斩",
    color: "#c45c26",
    desc: "均衡的近战职业，起步稳、伤害扎实。",
    maxHp: 70,
    energy: 3,
    startGold: 50,
    goldPerTurn: 12,
    unlocked: true,
    selected: true,
    placeholder: "⚔ 剑士",
  },
  {
    id: "mage",
    name: "咒术师",
    title: "炎符",
    color: "#3d6b8c",
    desc: "高费高伤，擅长范围咒术与灼烧。",
    maxHp: 55,
    energy: 3,
    startGold: 55,
    goldPerTurn: 14,
    unlocked: true,
    selected: false,
    placeholder: "🔥 咒术",
  },
  {
    id: "assassin",
    name: "影刃",
    title: "夜狩",
    color: "#5a3d6b",
    desc: "脆皮爆发，击杀回能，速战速决。",
    maxHp: 48,
    energy: 4,
    startGold: 60,
    goldPerTurn: 13,
    unlocked: false,
    selected: false,
    placeholder: "🗡 影刃",
    unlockHint: "累计通关 2 次后解锁",
  },
  {
    id: "guardian",
    name: "御盾",
    title: "铁壁",
    color: "#4a6b3d",
    desc: "厚血高防，以守待攻，反伤见长。",
    maxHp: 90,
    energy: 3,
    startGold: 45,
    goldPerTurn: 11,
    unlocked: false,
    selected: false,
    placeholder: "🛡 御盾",
    unlockHint: "累计通关 4 次后解锁",
  },
];

const shopCards = [
  {
    name: "斩击",
    type: "attack",
    rarity: "common",
    star: 2,
    cost: 1,
    desc: "造成 14 点伤害。（★★★解锁「破军一闪」）",
    price: 27,
    typeLabel: "攻击",
    ult: false,
  },
  {
    name: "一心斩",
    type: "attack",
    rarity: "uncommon",
    star: 3,
    cost: 2,
    desc: "造成 44 点伤害。【大招·无想剑】额外造成 40 点伤害，回复 1 能量",
    price: 88,
    typeLabel: "大招",
    ult: true,
    ultName: "无想剑",
  },
  {
    name: "疗伤散",
    type: "skill",
    rarity: "uncommon",
    star: 1,
    cost: 1,
    desc: "回复 8 点生命。（★★★解锁「回春秘剂」）",
    price: 33,
    typeLabel: "技能",
    ult: false,
  },
];

const handCards = [
  {
    name: "斩击",
    type: "attack",
    rarity: "common",
    star: 1,
    cost: 1,
    desc: "造成 8 点伤害",
    typeLabel: "攻击",
    playable: true,
  },
  {
    name: "格挡",
    type: "skill",
    rarity: "common",
    star: 2,
    cost: 1,
    desc: "获得 10 点护甲",
    typeLabel: "技能",
    playable: true,
  },
  {
    name: "一心斩",
    type: "attack",
    rarity: "rare",
    star: 3,
    cost: 2,
    desc: "造成 44 点伤害。【大招·无想剑】+40伤害，+1能量",
    typeLabel: "大招",
    ult: true,
    ultName: "无想剑",
    playable: true,
  },
  {
    name: "裂空",
    type: "attack",
    rarity: "rare",
    star: 2,
    cost: 2,
    desc: "造成 38 点伤害。（★★★解锁「天裂斩」）",
    typeLabel: "攻击",
    playable: false,
  },
  {
    name: "回旋刀",
    type: "attack",
    rarity: "uncommon",
    star: 1,
    cost: 1,
    desc: "造成 5 点伤害 × 2 次",
    typeLabel: "攻击",
    playable: true,
  },
];

const cardsAttack1 = [
  { name: "斩击", cost: 1, desc: "造成 8 点伤害", price: 18 },
  { name: "炎咒", cost: 1, desc: "造成 7 伤害，施加 2 灼烧", price: 18 },
  { name: "刺击", cost: 1, desc: "造成 9 点伤害", price: 17 },
  { name: "重击", cost: 1, desc: "造成 6 伤害，3 护甲", price: 18 },
];
const cardsAttack2 = [
  { name: "一心斩", cost: 2, desc: "造成 28 点伤害", price: 56 },
  { name: "回旋刀", cost: 1, desc: "造成 9 伤害 × 2 次", price: 49 },
  { name: "背刺", cost: 0, desc: "造成 19 点伤害", price: 60 },
  { name: "处决", cost: 2, desc: "24 伤害；半血 +17", price: 74 },
];
const cardsAttack3 = [
  {
    name: "斩击",
    cost: 1,
    desc: "22 伤害。【破军一闪】+28 穿透伤害",
    price: 142,
    ultName: "破军一闪",
  },
  {
    name: "业火",
    cost: 2,
    desc: "33 伤害 +11 灼烧。【焚天劫】+32穿透+12灼烧",
    price: 308,
    ultName: "焚天劫",
  },
  {
    name: "处决",
    cost: 2,
    desc: "38伤害+27。【绝命裁断】+36+24；回2能量",
    price: 323,
    ultName: "绝命裁断",
  },
  {
    name: "裂空",
    cost: 2,
    desc: "60 伤害。【天裂斩】+48穿透+8护甲",
    price: 339,
    ultName: "天裂斩",
  },
];
const cardsSkill = [
  { name: "格挡", cost: 1, desc: "获得 6 护甲", price: 16, rarity: "common" },
  {
    name: "结界",
    cost: 1,
    desc: "5 护甲 + 2 治疗",
    price: 17,
    rarity: "common",
  },
  { name: "灵涌", cost: 0, desc: "+2 能量", price: 30, rarity: "uncommon" },
  {
    name: "烟遁",
    cost: 1,
    desc: "4 护甲，抽 1 张牌",
    price: 18,
    rarity: "common",
  },
  {
    name: "反击",
    cost: 1,
    desc: "7 护甲 + 4 反伤",
    price: 30,
    rarity: "uncommon",
  },
  { name: "固守", cost: 2, desc: "获得 18 护甲", price: 38, rarity: "rare" },
];
const cardsSkill3 = [
  {
    name: "格挡",
    cost: 1,
    desc: "16护甲。【金刚壁】+22护甲+6生命",
    price: 124,
    ultName: "金刚壁",
  },
  {
    name: "铁壁",
    cost: 1,
    desc: "27护甲。【不灭城垣】+30护甲+8反伤",
    price: 140,
    ultName: "不灭城垣",
  },
  {
    name: "灵涌",
    cost: 0,
    desc: "+5能量。【咒源爆发】+3能量+抽2+15伤害",
    price: 233,
    ultName: "咒源爆发",
  },
  {
    name: "固守",
    cost: 2,
    desc: "49护甲。【天盾降临】+40护甲+6反伤+15治疗",
    price: 295,
    ultName: "天盾降临",
  },
];

const enemies = [
  {
    id: "imp",
    name: "小鬼",
    hp: 28,
    damage: 6,
    placeholder: "小鬼",
    bg: "linear-gradient(135deg, #4a241c, #1c1712)",
    note: "矮小鬼物、爪牙，普通层出场",
    elite: false,
    boss: false,
  },
  {
    id: "hound",
    name: "血犬",
    hp: 34,
    damage: 8,
    placeholder: "血犬",
    bg: "linear-gradient(135deg, #5a1a1a, #1c1712)",
    note: "妖犬、血红双眼，速度极快",
    elite: false,
    boss: false,
  },
  {
    id: "brute",
    name: "蛮鬼",
    hp: 48,
    damage: 10,
    placeholder: "蛮鬼",
    bg: "linear-gradient(135deg, #3d2a1a, #1c1712)",
    note: "粗壮、偶尔架盾（30%）",
    elite: false,
    boss: false,
  },
  {
    id: "shaman",
    name: "咒鬼",
    hp: 36,
    damage: 7,
    placeholder: "咒鬼",
    bg: "linear-gradient(135deg, #3d2a5a, #1c1712)",
    note: "巫祝、灼烧咒文",
    elite: false,
    boss: false,
  },
  {
    id: "elite",
    name: "鬼将",
    hp: 70,
    damage: 14,
    placeholder: "鬼 将",
    bg: "linear-gradient(135deg, #6b4f1f, #1c1712)",
    note: "甲胄鬼将、压迫感，每 3 层出场",
    elite: true,
    boss: false,
  },
  {
    id: "boss",
    name: "百目鬼王",
    hp: 120,
    damage: 16,
    placeholder: "百目鬼王",
    bg: "linear-gradient(135deg, #7a1f14, #3a1410, #1c1712)",
    note: "多眼、巨影、最终敌，第 10 层 BOSS",
    elite: true,
    boss: true,
  },
];

function scrollTo(id) {
  active.value = id;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
onMounted(() => {
  const handler = () => {
    const scrollY = window.scrollY + 120;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i].id);
      if (el && el.offsetTop <= scrollY) {
        active.value = sections[i].id;
        break;
      }
    }
  };
  window.addEventListener("scroll", handler);
});
</script>

<style scoped>
.preview-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(28, 23, 18, 0.92);
  border-bottom: 1px solid rgba(217, 203, 179, 0.15);
  backdrop-filter: blur(8px);
}
.nav-inner {
  max-width: 1360px;
  margin: 0 auto;
  padding: 14px 32px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.nav-title {
  font-family: var(--font-display);
  color: var(--paper);
  font-weight: 700;
  letter-spacing: 0.16em;
  font-size: 1rem;
  white-space: nowrap;
}
.nav-links {
  display: flex;
  gap: 4px;
  flex: 1;
  flex-wrap: wrap;
}
.nav-links a {
  padding: 6px 14px;
  color: rgba(217, 203, 179, 0.65);
  text-decoration: none;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  border-radius: 2px;
  transition: all 0.2s;
}
.nav-links a:hover {
  color: var(--paper);
  background: rgba(217, 203, 179, 0.08);
}
.nav-links a.active {
  color: var(--paper);
  background: var(--blood);
}
.nav-back {
  padding: 8px 16px !important;
  font-size: 0.85rem !important;
}

.view.preview {
  max-width: 1360px;
  margin: 0 auto;
  padding-top: 90px;
  color: var(--paper);
}

.preview-section {
  margin-bottom: 56px;
  scroll-margin-top: 90px;
}
.section-label {
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.2em;
  color: var(--gold);
  margin: 0 0 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(201, 162, 39, 0.25);
}
.section-body {
  color: var(--ink);
}

/* Home Mock */
.home-mock {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  padding: 40px;
  align-items: stretch;
}
.home-left {
  padding: 10px;
}
.eyebrow {
  margin: 0 0 12px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--ink-soft);
  font-size: 0.85rem;
}
.title-xl {
  font-size: clamp(3rem, 7vw, 6rem);
  line-height: 0.95;
  background: linear-gradient(180deg, #1c1712 0%, #5c180f 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-stroke: 1px var(--blood);
  text-shadow: 0 6px 24px rgba(155, 45, 31, 0.18);
}
.tagline {
  margin: 18px 0 28px;
  font-size: 1.15rem;
  line-height: 1.7;
  color: var(--ink-soft);
}
.cta {
  display: flex;
  gap: 14px;
}
.stats {
  display: flex;
  gap: 18px;
  margin: 32px 0 0;
  padding: 16px 0 0;
  list-style: none;
  color: var(--ink-soft);
  letter-spacing: 0.06em;
  border-top: 1px dashed var(--line);
}
.stats strong {
  color: var(--blood);
  font-family: var(--font-display);
  margin: 0 4px;
}
.rules-side {
  padding: 24px;
  background: rgba(28, 23, 18, 0.06);
  border: 1px solid var(--line);
}
.rules-side h2 {
  margin: 0 0 14px;
  font-family: var(--font-display);
  letter-spacing: 0.14em;
  border-bottom: 2px solid var(--blood);
  padding-bottom: 8px;
  display: inline-block;
}
.rules-side ol {
  margin: 0;
  padding-left: 1.2em;
  line-height: 1.9;
  color: var(--ink-soft);
}
.rules-side strong {
  color: var(--blood);
}

/* Class Mock */
.class-mock {
  padding: 28px 32px 36px;
}
.top-mock {
  margin-bottom: 22px;
}
.top-mock .back {
  color: var(--ink-soft);
  letter-spacing: 0.08em;
  display: inline-block;
  margin-bottom: 10px;
  cursor: pointer;
}
.top-mock h1 {
  margin: 8px 0 4px;
  font-size: clamp(2rem, 4vw, 3rem);
}
.top-mock p {
  margin: 0;
  color: var(--ink-soft);
}
.grid-mock {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.class-card-mock {
  position: relative;
  padding: 18px 16px 16px;
  background: linear-gradient(
    180deg,
    rgba(217, 203, 179, 0.96),
    rgba(196, 179, 150, 0.92)
  );
  border: 2px solid transparent;
  box-shadow: var(--shadow);
  transition: transform 0.25s ease, border-color 0.25s ease;
  overflow: hidden;
  cursor: pointer;
}
.class-card-mock:hover {
  transform: translateY(-4px);
}
.class-card-mock.selected {
  border-color: var(--accent);
}
.class-card-mock.selected::before {
  content: "✓";
  position: absolute;
  top: 10px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--paper);
  display: grid;
  place-items: center;
  font-size: 0.85rem;
}
.class-card-mock.locked {
  filter: grayscale(0.7);
  opacity: 0.72;
  cursor: not-allowed;
}
.portrait {
  height: 120px;
  margin-bottom: 14px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(28, 23, 18, 0.2);
  position: relative;
  overflow: hidden;
}
.portrait::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E");
}
.portrait-placeholder {
  font-family: var(--font-display);
  color: var(--paper);
  letter-spacing: 0.2em;
  font-size: 1.4rem;
  z-index: 1;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
.mark {
  width: 42px;
  height: 6px;
  background: var(--accent);
  margin-bottom: 12px;
}
.class-card-mock h2 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.14em;
  font-size: 1.5rem;
}
.class-card-mock .title {
  margin: 4px 0 12px;
  color: var(--ink-soft);
  letter-spacing: 0.2em;
  font-size: 0.9rem;
}
.class-card-mock .desc {
  margin: 0 0 14px;
  line-height: 1.5;
  min-height: 3em;
  color: var(--ink-soft);
  font-size: 0.92rem;
}
.class-card-mock ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--ink-soft);
}
.lock {
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px dashed var(--line);
  color: var(--blood);
  font-size: 0.82rem;
  display: flex;
  align-items: center;
  gap: 6px;
}
.lock-icon {
  font-size: 0.9rem;
}
.footer-mock {
  margin-top: 26px;
  display: flex;
  justify-content: center;
}

/* Battle Mock */
.battle-mock {
}
.hud-mock {
  display: grid;
  grid-template-columns: 1.1fr 1.4fr 1.2fr;
  gap: 20px;
  padding: 16px 22px;
  align-items: center;
}
.identity {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.identity .class-name {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 900;
  letter-spacing: 0.14em;
}
.identity .meta {
  color: var(--ink-soft);
  letter-spacing: 0.08em;
  font-size: 0.9rem;
}
.meters .meter-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.9rem;
}
.resources {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}
.chip {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(28, 23, 18, 0.08);
  border: 1px solid var(--line);
  min-width: 92px;
}
.chip .icon {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  font-size: 0.75rem;
  background: var(--ink);
  color: var(--paper);
}
.chip.gold strong {
  color: #8a6a12;
}
.chip.energy strong {
  color: #2a4a6b;
}
.chip small {
  color: var(--ink-soft);
  font-size: 0.75rem;
}

.arena-mock {
  display: grid;
  grid-template-columns: 1.1fr 1.2fr 0.8fr;
  gap: 14px;
  margin-top: 14px;
}
.enemy-zone,
.log {
  padding: 18px;
  min-height: 340px;
}

.enemy-portrait {
  height: 140px;
  background: linear-gradient(135deg, #6b4f1f, #1c1712);
  display: grid;
  place-items: center;
  margin-bottom: 10px;
  border: 1px solid rgba(28, 23, 18, 0.25);
  position: relative;
}
.enemy-portrait::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E");
}
.enemy-portrait .portrait-placeholder {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}
.elite-portrait {
  box-shadow: 0 0 20px rgba(201, 162, 39, 0.28) inset;
}
.enemy h2 {
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
}
.intent {
  margin-bottom: 14px;
  color: var(--ink-soft);
  display: flex;
  align-items: center;
  gap: 8px;
}
.intent-icon {
  color: var(--blood);
  font-size: 1.1rem;
}
.intent strong {
  color: var(--blood);
  font-family: var(--font-display);
  font-size: 1.2rem;
}
.status-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.burn-tag {
  background: rgba(196, 92, 38, 0.15);
  color: var(--ember);
  padding: 4px 10px;
  font-size: 0.85rem;
  border: 1px solid rgba(196, 92, 38, 0.3);
}
.block-tag {
  background: rgba(42, 74, 107, 0.15);
  color: #2a4a6b;
  padding: 4px 10px;
  font-size: 0.85rem;
  border: 1px solid rgba(42, 74, 107, 0.3);
}

/* Shop mock */
.shop-mock {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.shop-mock header h2 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  font-size: 1.25rem;
}
.shop-mock header p {
  margin: 6px 0 0;
  color: var(--ink-soft);
  font-size: 0.85rem;
}
.offers {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  min-height: 230px;
  align-items: flex-start;
  padding: 10px 0;
}
.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.btn-ghost.dark {
  color: var(--ink);
  border-color: rgba(28, 23, 18, 0.3);
  background: rgba(28, 23, 18, 0.06);
}

/* Log */
.log h3 {
  margin: 0 0 10px;
  font-family: var(--font-display);
  letter-spacing: 0.1em;
}
.log ul {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 300px;
  overflow: auto;
}
.log li {
  padding: 7px 0;
  border-bottom: 1px dashed var(--line);
  color: var(--ink-soft);
  font-size: 0.88rem;
  line-height: 1.5;
}
.log li strong {
  color: var(--blood);
}

/* Hand dock */
.hand-dock-mock {
  margin-top: 14px;
  padding: 28px 24px 32px;
  background: linear-gradient(180deg, transparent, rgba(12, 8, 5, 0.88) 35%);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 18px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}
.hand-mock {
  display: flex;
  justify-content: center;
  padding: 20px 40px 0;
  min-height: 240px;
  align-items: flex-end;
}
.end-turn {
  min-width: 140px;
  margin-left: 14px;
}

/* Cards (reused in shop & hand) */
.card {
  position: relative;
  width: 140px;
  min-height: 200px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  text-align: left;
  color: var(--paper);
  border: 2px solid rgba(232, 213, 163, 0.35);
  background: linear-gradient(165deg, #3a2a22 0%, #1f1712 100%);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex-shrink: 0;
  margin: 0 -4px;
}
.card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 18px 32px rgba(0, 0, 0, 0.5);
  border-color: var(--gold);
  z-index: 2;
}
.card.playable {
  border-color: rgba(201, 162, 39, 0.75);
  box-shadow: 0 0 0 1px rgba(201, 162, 39, 0.35), 0 12px 28px rgba(0, 0, 0, 0.4);
}
.card.type-attack {
  background: linear-gradient(165deg, #4a241c 0%, #1a1210 100%);
}
.card.type-skill {
  background: linear-gradient(165deg, #1f3a32 0%, #121816 100%);
}
.card.rarity-uncommon {
  border-color: rgba(217, 203, 179, 0.55);
}
.card.rarity-rare {
  border-color: rgba(201, 162, 39, 0.55);
}
.card.ultimate {
  width: 150px;
  min-height: 220px;
  border-color: #c9a227;
  background: linear-gradient(165deg, #5a3a14 0%, #2a1810 55%, #1a1210 100%);
  box-shadow: 0 0 0 1px rgba(201, 162, 39, 0.45),
    0 14px 28px rgba(0, 0, 0, 0.45);
}
.ult-badge {
  position: absolute;
  top: 38px;
  right: 6px;
  padding: 2px 6px;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  background: var(--blood);
  color: var(--paper);
  box-shadow: 0 2px 6px rgba(155, 45, 31, 0.4);
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cost {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #2a4a6b;
  color: #e8f0f8;
  font-weight: 700;
  font-size: 0.9rem;
  border: 1px solid rgba(232, 240, 248, 0.35);
}
.stars {
  color: var(--gold);
  letter-spacing: 1px;
  font-size: 0.82rem;
}
.card .name {
  margin: 12px 0 3px;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}
.ult-name {
  margin: 0 0 5px;
  color: #e8c56a;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
}
.card .desc {
  margin: 0;
  flex: 1;
  font-size: 0.78rem;
  line-height: 1.4;
  color: rgba(232, 213, 163, 0.88);
}
.card-foot {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: rgba(232, 213, 163, 0.55);
}
.price {
  color: var(--gold);
  font-weight: 700;
}

/* Cards section */
.cards-mock {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.cards-group {
}
.group-title {
  margin: 0 0 12px;
  font-family: var(--font-display);
  color: var(--paper);
  font-size: 1.1rem;
  letter-spacing: 0.12em;
  display: flex;
  align-items: center;
  gap: 10px;
}
.swatch {
  width: 14px;
  height: 14px;
  display: inline-block;
}
.swatch.attack {
  background: var(--blood);
}
.swatch.skill {
  background: #2f5a4a;
}
.swatch.gold {
  background: var(--gold);
}
.cards-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px;
  background: rgba(28, 23, 18, 0.4);
  border: 1px dashed rgba(217, 203, 179, 0.2);
}
.cards-row .card {
  margin: 0;
  transform: none !important;
}

/* Enemies */
.enemies-mock {
  padding: 28px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
}
.enemy-card {
  position: relative;
  padding: 12px 12px 16px;
  background: linear-gradient(
    180deg,
    rgba(217, 203, 179, 0.8),
    rgba(196, 179, 150, 0.75)
  );
  border: 2px solid transparent;
  transition: transform 0.2s;
}
.enemy-card:hover {
  transform: translateY(-4px);
}
.enemy-card.elite {
  border-color: rgba(201, 162, 39, 0.45);
}
.enemy-card.boss {
  border-color: var(--blood);
  background: linear-gradient(
    180deg,
    rgba(217, 203, 179, 0.85),
    rgba(201, 140, 120, 0.5)
  );
  animation: pulseSoft 1.8s ease infinite;
}
.enemy-portrait-mock {
  height: 110px;
  display: grid;
  place-items: center;
  margin-bottom: 10px;
  border: 1px solid rgba(28, 23, 18, 0.2);
  position: relative;
  overflow: hidden;
}
.enemy-portrait-mock::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E");
}
.enemy-portrait-mock .portrait-placeholder {
  font-size: 1.1rem;
  font-weight: 700;
}
.enemy-card h4 {
  margin: 6px 0;
  font-family: var(--font-display);
  letter-spacing: 0.1em;
  font-size: 1rem;
  text-align: center;
}
.enemy-stats {
  display: flex;
  justify-content: space-around;
  font-size: 0.82rem;
  color: var(--ink-soft);
  letter-spacing: 0.05em;
  padding: 6px 0;
  border-top: 1px dashed var(--line);
  border-bottom: 1px dashed var(--line);
}
.enemy-note {
  margin: 8px 0 0;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--ink-soft);
}

/* Modals */
.modals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}
.modal-wrap {
}
.modal-title {
  margin: 0 0 12px;
  font-family: var(--font-display);
  color: var(--paper);
  font-size: 1rem;
  letter-spacing: 0.12em;
}
.modal-bg {
  padding: 22px;
  background: rgba(12, 8, 5, 0.65);
  border: 1px solid rgba(217, 203, 179, 0.15);
  display: grid;
  place-items: center;
  min-height: 500px;
  position: relative;
}
.modal-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
}
.modal {
  position: relative;
  width: 100%;
  max-height: 460px;
  overflow: auto;
  padding: 20px 22px 24px;
}
.modal header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal header h2 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.1em;
  font-size: 1.4rem;
}
.close {
  font-size: 1.8rem;
  line-height: 1;
  color: var(--ink-soft);
  cursor: pointer;
}
.hint {
  color: var(--ink-soft);
  line-height: 1.5;
  font-size: 0.9rem;
}
.hint strong {
  color: var(--blood);
}
.groups {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 14px 0;
}
.group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(28, 23, 18, 0.06);
  border: 1px solid var(--line);
}
.group.ready {
  border-color: rgba(155, 45, 31, 0.45);
  background: rgba(155, 45, 31, 0.08);
}
.info {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
}
.count {
  color: var(--ink-soft);
  font-size: 0.9rem;
}
.count.full {
  color: var(--blood);
  font-weight: 700;
}
.extra {
  font-size: 0.8rem;
  color: var(--ink-soft);
}
.deck-list h3 {
  margin: 14px 0 6px;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
}
.deck-list ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 14px;
}
.deck-list li {
  padding: 4px 0;
  border-bottom: 1px dashed var(--line);
  font-size: 0.85rem;
}
.deck-list .stars {
  font-size: 0.82rem;
  margin-right: 2px;
}
.ult-tag {
  margin-left: 4px;
  color: var(--blood);
  font-size: 0.75rem;
}

.result-bg-win {
  background: radial-gradient(
    ellipse at center,
    rgba(201, 162, 39, 0.2),
    rgba(12, 8, 5, 0.7)
  );
}
.result-bg-lose {
  background: radial-gradient(
    ellipse at center,
    rgba(155, 45, 31, 0.2),
    rgba(12, 8, 5, 0.8)
  );
}

.result-panel-win,
.result-panel-lose {
  text-align: center;
  position: relative;
  overflow: hidden;
}
.result-win-title {
  font-size: 2.6rem;
  letter-spacing: 0.3em;
  color: #8a6a12;
  text-shadow: 0 0 24px rgba(201, 162, 39, 0.3);
  margin: 8px 0 4px !important;
}
.result-lose-title {
  font-size: 2.6rem;
  letter-spacing: 0.3em;
  color: var(--blood);
  text-shadow: 0 0 24px rgba(155, 45, 31, 0.4);
  margin: 8px 0 4px !important;
}
.result-seal-win,
.result-seal-lose {
  width: 82px;
  height: 82px;
  margin: 8px auto 14px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 900;
  letter-spacing: 0;
}
.result-seal-win {
  background: radial-gradient(circle, #c9a227 0%, #6b4f1f 100%);
  color: var(--paper);
  box-shadow: 0 0 24px rgba(201, 162, 39, 0.5),
    inset 0 0 16px rgba(0, 0, 0, 0.25);
  transform: rotate(-6deg);
}
.result-seal-lose {
  background: radial-gradient(circle, var(--blood) 0%, #3a0f08 100%);
  color: var(--paper);
  box-shadow: 0 0 24px rgba(155, 45, 31, 0.5), inset 0 0 16px rgba(0, 0, 0, 0.3);
  transform: rotate(8deg);
}
.result-panel-win p,
.result-panel-lose p {
  color: var(--ink-soft);
  line-height: 1.7;
  margin: 0 0 16px;
}
.result-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px 0;
  border-top: 1px dashed var(--line);
  border-bottom: 1px dashed var(--line);
}
.result-stats > div {
  display: flex;
  flex-direction: column;
}
.result-stats span {
  font-size: 0.78rem;
  color: var(--ink-soft);
  letter-spacing: 0.06em;
}
.result-stats strong {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--ink);
  margin-top: 4px;
}
.result-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.toast-bg {
  display: flex;
  flex-direction: column;
  gap: 18px;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, rgba(12, 8, 5, 0.4), rgba(12, 8, 5, 0.8));
}
.merge-toast-demo {
  padding: 12px 28px;
  background: var(--blood);
  color: var(--paper);
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  box-shadow: 0 8px 22px rgba(155, 45, 31, 0.4);
  position: relative;
  animation: fadeUp 0.4s ease both;
}
.merge-toast-demo.alt {
  background: var(--ink);
  border: 1px solid var(--gold);
}
.merge-toast-demo.ult {
  background: linear-gradient(90deg, var(--gold), var(--ember));
  color: var(--ink);
  font-weight: 700;
  box-shadow: 0 0 28px rgba(201, 162, 39, 0.5);
}

/* Spec */
.spec-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.spec-card {
  padding: 22px 26px;
}
.spec-card h3 {
  margin: 0 0 14px;
  font-family: var(--font-display);
  letter-spacing: 0.1em;
  font-size: 1.1rem;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--line);
}
.color-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.swatch-xl {
  padding: 14px 14px 12px;
  color: var(--paper);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
}
.swatch-xl span {
  font-family: var(--font-display);
  letter-spacing: 0.08em;
}
.swatch-xl code {
  font-family: "Consolas", monospace;
  font-size: 0.75rem;
  opacity: 0.85;
}
.type-sample {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.type-display {
  font-family: var(--font-display);
  font-size: 1.4rem;
  letter-spacing: 0.12em;
}
.type-body {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--ink-soft);
}
.type-huge {
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-align: center;
  padding: 10px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.icon-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 4px;
  background: rgba(28, 23, 18, 0.06);
  border: 1px solid var(--line);
}
.icon-chip span {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--paper);
  font-weight: 700;
  font-size: 0.9rem;
}
.icon-chip.hp span {
  background: var(--blood);
}
.icon-chip.block span {
  background: #3d5a6b;
}
.icon-chip.gold span {
  background: var(--gold);
  color: var(--ink);
}
.icon-chip.energy span {
  background: #2a4a6b;
}
.icon-chip.burn span {
  background: var(--ember);
}
.icon-chip.thorns span {
  background: #4a6b3d;
}
.icon-chip.weaken span {
  background: #5a3d6b;
}
.icon-chip.pierce span {
  background: #6b4f1f;
}
.icon-chip.deck span {
  background: var(--ink-soft);
}
.icon-chip.refresh span {
  background: #3d6b8c;
}
.icon-chip.merge span {
  background: linear-gradient(135deg, var(--gold), var(--blood));
}
.icon-chip.lock span {
  background: #3a3228;
}
.icon-chip em {
  font-style: normal;
  font-size: 0.75rem;
  color: var(--ink-soft);
  letter-spacing: 0.05em;
}

.badge-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.badge-demo {
  display: inline-block;
  padding: 5px 12px;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  background: var(--ink);
  color: var(--paper);
}
.badge-demo.elite {
  background: #6b4f1f;
}
.badge-demo.boss {
  background: var(--blood);
}
.badge-demo.star {
  background: var(--gold);
  color: var(--ink);
  font-weight: 700;
}
.badge-demo.ult {
  background: var(--blood);
  border: 1px solid var(--gold);
}

.btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.bars-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-foot {
  padding: 32px 0 16px;
  text-align: center;
  color: rgba(217, 203, 179, 0.35);
  letter-spacing: 0.2em;
  font-size: 0.85rem;
  border-top: 1px solid rgba(217, 203, 179, 0.1);
  margin-top: 20px;
}

@media (max-width: 1100px) {
  .home-mock {
    grid-template-columns: 1fr;
  }
  .grid-mock {
    grid-template-columns: repeat(2, 1fr);
  }
  .arena-mock {
    grid-template-columns: 1fr;
  }
  .enemies-mock {
    grid-template-columns: repeat(3, 1fr);
  }
  .modals-grid {
    grid-template-columns: 1fr;
  }
  .spec-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .grid-mock {
    grid-template-columns: 1fr;
  }
  .enemies-mock {
    grid-template-columns: repeat(2, 1fr);
  }
  .hud-mock {
    grid-template-columns: 1fr;
  }
  .resources {
    justify-content: flex-start;
  }
  .nav-links {
    display: none;
  }
}
</style>
