# 斩鬼录 · 音效清单 & AI 提示词表

> 面向 ElevenLabs Sound Effects、Stable Audio 3 Small-SFX、Meta AudioGen 等文生音效工具。
> 建议每条生成 **3～5 个变体**，Audacity 裁切后选用最佳。
>
> **目标目录**：`public/assets/audio/`（接入游戏前可先放 `material/audio/` 试播）

---

## 一、通用风格前缀（每张提示词前拼接）

### 1.1 正向前缀（必加）

**中文：**

```
国风暗黑志怪游戏音效，炭黑阴郁氛围，宣纸干燥质感，朱红血色点缀，鎏金金属冷冽感，厚重肃杀不卡通，高对比短促有力，无旋律无人声，游戏 UI 或战斗反馈音
```

**English：**

```
Dark Chinese ghost folklore game sound effect, charcoal gloom atmosphere, dry rice-paper texture, cinnabar blood-red accents, cold gilt metal resonance, solemn and lethal not cartoonish, high contrast punchy, no melody no vocals, game UI or combat feedback
```

### 1.2 负面提示词（工具支持时必加）

**中文：**

```
低质量，模糊，刺耳噪点，现代电子合成器，西方中世纪，日式和风，鸟居，樱花，Q 版卡通，搞笑，八音盒，流行鼓点，人声，歌词，旋律过长，混响过重，尾音拖沓
```

**English：**

```
low quality, muddy, harsh noise, modern EDM synth, western medieval, Japanese anime style, shrine, cherry blossom, cartoonish, comedic, music box, pop drums, vocals, lyrics, long melodic tail, excessive reverb, long decay
```

### 1.3 BGM 专用前缀（仅背景音乐条目不拼战斗前缀）

**English：**

```
Dark Chinese ghost folklore instrumental loop, Search of the Supernatural mood, charcoal atmosphere, rice-paper texture, cinnabar and gilt accents, no vocals no lyrics, game battle or ambient background music, seamless loop friendly
```

---

## 二、文件命名与格式建议

| 项 | 建议 |
| --- | --- |
| 短音效 SFX | OGG 或 MP3，44.1kHz，单声道或立体声均可 |
| 循环 BGM | OGG，立体声，目标 1～3 MB / 首 |
| 音量 | 后期归一化到 -3～-6 dBFS，UI 略轻、大招略重 |
| 变体 | 文件名加 `-v2`、`-v3` 备选 |

**目录结构：**

```
public/assets/audio/
  sfx/          # 短音效
  bgm/          # 背景音乐循环
  ambient/      # 环境氛围循环（可选）
```

---

## 三、完整音效清单

> 列说明：**ID** = 建议文件名（不含扩展名）；**时长** = AI 生成 `duration_seconds`；**循环** = ElevenLabs `loop` 或后期循环。

### 3.1 UI / 导航

| ID | 触发时机 | 时长(s) | 循环 | 中文提示词 | English Prompt |
| --- | --- | --- | --- | --- | --- |
| `ui-click` | 通用按钮点击 | 0.3 | 否 | 短促宣纸按压声，干燥纸面轻啪，国风 UI 点击反馈，极短干脆 | Short dry rice-paper tap click, Chinese UI button feedback, extremely brief and crisp |
| `ui-hover` | 按钮 / 卡牌悬停 | 0.2 | 否 | 极轻符纸摩擦声，几乎听不见的纸张掠过，UI 悬停提示 | Very soft talisman paper brush, subtle UI hover whisper, barely audible |
| `ui-back` | 返回首页 | 0.4 | 否 | 卷轴回卷半声，纸张逆向摩擦，短促退回感 | Half scroll rewind, paper pull back, short back navigation cue |
| `ui-confirm` | 确认（踏入鬼域等） | 0.5 | 否 | 朱砂印章盖下，短促有力，国风确认，带轻微木桌闷响 | Cinnabar seal stamp on wood desk, short authoritative confirm, Chinese official seal |
| `ui-deny` | 操作不可用（锁职业等） | 0.4 | 否 | 生锈铁锁轻晃拒绝声，沉闷短促，不可操作反馈 | Rusty iron lock rattle deny, dull short rejection feedback |
| `ui-panel-open` | 弹层打开（合成/宝物/市集） | 0.6 | 否 | 卷轴横向展开，宣纸拉开，轻微木轴转动，面板打开 | Horizontal scroll unfurling, rice paper opening, light wooden roller turn |
| `ui-panel-close` | 弹层关闭 | 0.5 | 否 | 卷轴快速收拢，纸张闭合，短促面板关闭 | Scroll snapping shut, paper fold close, brief panel dismiss |
| `home-start` | 首页「新的游戏」 | 0.8 | 否 | 踏入鬼域前兆，低沉鬼风一过，符纸点燃瞬间，带期待感 | Ominous ghost wind gust then talisman ignites, prelude to entering haunted realm |
| `class-select` | 选中职业卡高亮 | 0.5 | 否 | 鎏金细线亮起，轻微金属共鸣，职业选中高亮 | Thin gilt line ignites, subtle metal resonance, class card selected highlight |
| `class-confirm` | 确认职业出征 | 0.7 | 否 | 战鼓单击 + 短剑出鞘半声，出征确认，肃杀 | Single war drum hit plus half sword draw, departure confirm, martial solemn |

### 3.2 战斗流程 / 回合

| ID | 触发时机 | 时长(s) | 循环 | 中文提示词 | English Prompt |
| --- | --- | --- | --- | --- | --- |
| `battle-enter` | 进入新一层战斗 | 1.2 | 否 | 鬼雾涌入场，远处嚎叫垫音，战场展开，层数进入 | Ghost mist surges in, distant wail bed, battle arena opens, floor enter |
| `turn-start` | 玩家回合开始（回能量） | 0.6 | 否 | 更鼓单响，能量回流，清脆短促回合开始 | Single watch drum beat, energy returning pulse, turn start cue |
| `turn-end` | 点击结束回合 | 0.5 | 否 | 木鱼一声，回合递交，短促结束感 | Wooden fish single strike, turn handoff, brief end cue |
| `enemy-turn` | 敌方回合开始 | 0.7 | 否 | 阴风旋起，鬼气逼近，敌方行动预告 | Sinister wind swirl, ghost qi approaching, enemy turn warning |
| `gold-income` | 回合初自动加金币 | 0.4 | 否 | 两三枚方孔铜钱碰撞，清脆落袋，金币获得 | Two or three square-hole copper coins clink into pouch, gold gained |
| `energy-full` | 能量回满（可与 turn-start 共用） | 0.4 | 否 | 玉璜半璧形能量充盈，柔和灵光一闪，能量已满 | Jade half-disc energy fills, soft spiritual flash, energy restored |
| `draw-card` | 回合发牌 / 抽牌效果 | 0.4 | 否 | 卡牌从牌堆翻出，纸张快速摩擦，发牌声 | Card flipping from deck, fast paper friction, deal card |
| `hand-full` | 手牌满无法发牌（战报提示时） | 0.5 | 否 | 纸张堆满闷响，轻微拒绝感，手牌已满 | Paper stack full dull thud, subtle denial, hand full warning |
| `target-select` | 多目标卡牌点选敌人 | 0.3 | 否 | 短促锁敌标记音，朱砂点选，目标锁定 | Brief target lock marker, cinnabar selection ping, enemy targeted |
| `invalid-action` | 能量不足等无效操作 | 0.3 | 否 | 极短闷哼拒绝，操作无效 | Very short dull grunt deny, invalid action |

### 3.3 玩家受击 / 防御 / 状态

| ID | 触发时机 | 时长(s) | 循环 | 中文提示词 | English Prompt |
| --- | --- | --- | --- | --- | --- |
| `player-hurt` | 玩家受到伤害 | 0.5 | 否 | 人体闷击 + 鬼气侵蚀，沉重短促受击 | Body impact with ghost corrosion, heavy short player hurt |
| `player-hurt-heavy` | 大伤害 / Boss 重击 | 0.8 | 否 | 重甲锤击胸甲，震荡闷响，大伤害受击 | Heavy armor hammer blow, resonant thud, big damage hit |
| `block-gain` | 获得护甲 | 0.5 | 否 | 青铜盾面竖起，金属短鸣，护甲获得 | Bronze shield raises, short metallic ring, block gained |
| `block-absorb` | 护甲抵挡伤害 | 0.4 | 否 | 盾牌吸收冲击，金属闷震，伤害被挡 | Shield absorbs impact, metal damped thud, damage blocked |
| `block-break` | 护甲被击穿（可选） | 0.5 | 否 | 盾面碎裂一声，护甲破碎 | Shield face cracks, block shattered |
| `heal` | 治疗回血 | 0.7 | 否 | 翠绿灵光浸润，温和药草气息，生命回复 | Soft green spiritual glow, gentle herb aura, health restored |
| `heal-big` | 大招 / 宝物大量治疗 | 1.0 | 否 | 浓郁回春灵光扩散，较多生命回复 | Rich rejuvenation light expanding, major heal |
| `burn-apply` | 施加灼烧（玩家或敌人） | 0.5 | 否 | 鬼火附着噼啪，朱砂火焰舔舐，灼烧施加 | Ghost fire attaches crackling, cinnabar flames licking, burn applied |
| `burn-tick` | 灼烧结算伤害 | 0.4 | 否 | 火焰短促灼烧一声，灼烧伤害 | Short fire burn tick, burn damage tick |
| `weaken-apply` | 削弱敌人攻击 | 0.5 | 否 | 黑雾缠臂，力量被抽离，削弱施加 | Black mist wraps limb, strength drained, weaken applied |
| `thorns-hit` | 反伤触发 | 0.5 | 否 | 血色荆棘反弹，尖刺回刺，反伤 | Blood thorns lash back, spike retaliation, thorns reflect |
| `pierce-hit` | 穿透伤害（可选强调） | 0.4 | 否 | 利刃贯穿甲胄，穿透一击 | Blade pierces through armor, piercing strike accent |
| `lifesteal` | 剑士被动吸血触发 | 0.6 | 否 | 血色丝线回流体内，吸血汲取生命 | Blood thread flows back into body, life steal drain |
| `player-death` | 玩家阵亡 | 1.5 | 否 | 魂魄溃散，长叹息 + 鬼风，玩家死亡 | Soul disperses, long exhale with ghost wind, player death |

### 3.4 卡牌出牌 · 通用

| ID | 触发时机 | 时长(s) | 循环 | 中文提示词 | English Prompt |
| --- | --- | --- | --- | --- | --- |
| `card-play` | 任意卡牌打出（底噪层） | 0.3 | 否 | 卡牌拍下桌面，纸张啪声，出牌通用底 | Card slaps on table, paper snap, generic card play base |
| `card-attack` | 攻击牌通用 | 0.5 | 否 | 通用武器挥砍短音，攻击牌出牌 | Generic weapon slash short, attack card play |
| `card-skill` | 技能牌通用 | 0.5 | 否 | 符咒灵光轻闪，技能牌出牌 | Talisman spiritual flash, skill card play |
| `card-ult-charge` | 三星大招追加触发前兆 | 0.6 | 否 | 鎏金能量蓄积，大招前兆充能 | Gilt energy charging, ultimate prelude charge |
| `card-ult-hit` | 三星大招效果命中 | 1.2 | 否 | 史诗鎏金冲击 braam + 剑鸣，大招命中 | Epic gilt cinematic braam plus sword resonance, ultimate impact |
| `card-ult-voice` | 大招名闪屏（可选极短） | 0.8 | 否 | 鬼啸 + 钟鸣叠层，大招宣告，无歌词 | Ghost scream layered with bell toll, ultimate announce, no lyrics |

### 3.5 卡牌效果 · 按类型（可与职业条叠加播放）

| ID | 触发时机 | 时长(s) | 循环 | 中文提示词 | English Prompt |
| --- | --- | --- | --- | --- | --- |
| `fx-slash` | 斩击 / 剑类伤害 | 0.5 | 否 | 汉剑单次干净斩击，金属锐利，剑斩 | Single clean Chinese longsword slash, sharp metal, sword cut |
| `fx-slash-multi` | 多段斩（回旋刀等） | 0.8 | 否 | 连续快斩三下，短促连环剑击 | Three rapid sword cuts chained, short combo slashes |
| `fx-heavy-slash` | 重斩 / 裂空 | 0.7 | 否 | 沉重大剑劈落，地面震颤，重斩 | Heavy greatsword chop, ground tremor, heavy slash |
| `fx-stab` | 刺击 / 背刺 | 0.4 | 否 | 短刃突刺穿刺，极速一击，刺击 | Short blade thrust pierce, lightning stab |
| `fx-fire` | 火焰伤害 | 0.6 | 否 | 符火爆发，朱砂鬼火喷射，火焰伤害 | Talisman fire burst, cinnabar ghost flame jet, fire damage |
| `fx-fire-big` | 业火 / 焚天劫 | 1.0 | 否 | 大范围业火轰燃，火焰大爆炸 | Large karmic fire eruption, big fire explosion |
| `fx-shield` | 格挡 / 铁壁 | 0.5 | 否 | 石盾 / 铁壁竖起，沉重防护 | Stone or iron wall raises, heavy protection |
| `fx-shield-big` | 金刚壁 / 不灭城垣 | 0.9 | 否 | 巨型城垣屏障降临，大护盾 | Massive fortress barrier descends, big shield |
| `fx-heal-potion` | 疗伤散 | 0.6 | 否 | 药粉撒入温水氤氲，小治疗 | Medicinal powder dissolves in warm steam, small heal |
| `fx-smoke` | 烟遁 / 影遁 | 0.6 | 否 | 紫烟爆散身形一闪，烟雾位移 | Purple smoke burst shadow step, smoke dash |
| `fx-hammer` | 重击 / 震地锤 | 0.7 | 否 | 狼牙棒砸地，土石迸裂，锤击 | Spiked mace smashes ground, earth cracks, hammer hit |
| `fx-thunder` | 雷电（雷纹珠等） | 0.6 | 否 | 云雷符爆，短促雷鸣电击 | Cloud thunder talisman burst, short thunder crack |
| `fx-energy` | 获得能量（灵涌等） | 0.5 | 否 | 咒力涌入经脉，能量获得 | Spell power surges through meridians, energy gain |
| `fx-draw` | 抽牌效果 | 0.4 | 否 | 快速翻牌两张，抽牌 | Two cards flip rapidly, draw cards effect |
| `fx-execute` | 处决半血加成 | 0.7 | 否 | 断头刀落特殊重音，处决加成 | Executioner's blade special heavy accent, execute bonus |
| `fx-weaken` | 烟遁大招削弱 | 0.5 | 否 | 黑符贴额力量流失，削弱 | Black talisman on brow strength drains, weaken |
| `fx-reflect` | 御盾反伤被动 | 0.5 | 否 | 盾面反弹冲击波，反伤 | Shield reflects shockwave, reflect damage |

### 3.6 职业出牌风味（可选，与 fx-* 叠层）

| ID | 触发时机 | 时长(s) | 循环 | 中文提示词 | English Prompt |
| --- | --- | --- | --- | --- | --- |
| `class-swordsman` | 剑士攻击牌 | 0.5 | 否 | 破晓剑鸣，橙红剑气尾音，剑士风味 | Dawn-break sword ring, orange-red qi tail, swordsman flavor |
| `class-mage` | 咒术师攻击牌 | 0.5 | 否 | 符箓点燃噼啪，苍蓝咒火，咒术师风味 | Talisman ignites crackling, azure curse fire, mage flavor |
| `class-assassin` | 影刃攻击牌 | 0.5 | 否 | 月下刃风掠过，暗紫残影，影刃风味 | Moonlit blade wind pass, dark purple afterimage, assassin flavor |
| `class-guardian` | 御盾攻击/防牌 | 0.5 | 否 | 城垣铁甲震鸣，苍绿厚重，御盾风味 | Fortress iron armor resonance, olive-green weight, guardian flavor |
| `passive-crit` | 影刃暴击 | 0.6 | 否 | 暴击额外锐利金属闪光，伤害翻倍感 | Critical extra sharp metal flash, damage doubled feel |
| `passive-burn` | 咒术师额外灼烧 | 0.5 | 否 | 额外鬼火附着，被动灼烧 | Extra ghost fire attachment, passive burn proc |

### 3.7 敌人

| ID | 触发时机 | 时长(s) | 循环 | 中文提示词 | English Prompt |
| --- | --- | --- | --- | --- | --- |
| `enemy-attack` | 敌人普通攻击 | 0.5 | 否 | 鬼爪挥击，普通敌人攻击 | Ghost claw swipe, normal enemy attack |
| `enemy-attack-heavy` | 精英 / Boss 重击 | 0.8 | 否 | 重甲鬼将刀劈，沉重敌人重击 | Armored ghost general blade chop, heavy enemy attack |
| `enemy-burn-intent` | 咒鬼灼烧意图 | 0.6 | 否 | 巫祝念咒，鬼火意图，灼烧预告 | Shaman chant ghost fire intent, burn telegraph |
| `enemy-shield` | 蛮鬼架盾 | 0.5 | 否 | 巨盾竖起闷响，敌人防御 | Giant shield raises dull thud, enemy defend |
| `enemy-hurt` | 敌人受击 | 0.4 | 否 | 鬼躯闷震，敌人受击 | Ghost body dull impact, enemy hurt |
| `enemy-hurt-crit` | 敌人大伤害受击 | 0.6 | 否 | 鬼躯重创溃裂声，大伤害受击 | Ghost body heavy rupture, big enemy hurt |
| `enemy-death` | 敌人死亡 | 0.8 | 否 | 鬼气消散 + 符纸燃尽，敌人死亡 | Ghost qi disperses talisman burns out, enemy death |
| `enemy-death-boss` | Boss 死亡 | 1.5 | 否 | 百目闭合轰鸣，大型魂魄炸裂，Boss 死亡 | Hundred eyes close rumble, large soul explosion, boss death |
| `enemy-imp` | 小鬼出场 / 攻击（可选） | 0.5 | 否 | 矮小山精嬉笑尖叫，小鬼 | Small mountain spirit giggling scream, imp |
| `enemy-hound` | 血犬（可选） | 0.6 | 否 | 幽冥恶犬撕咬低吼，血犬 | Nether hound bite growl, blood hound |
| `enemy-brute` | 蛮鬼（可选） | 0.6 | 否 | 魁梧蛮鬼咆哮踏步，蛮鬼 | Hulking brute roar stomp, brute |
| `enemy-shaman` | 咒鬼（可选） | 0.7 | 否 | 骷髅面具巫祝尖笑念咒，咒鬼 | Skull mask shaman screech chant, shaman |
| `enemy-elite` | 鬼将（可选） | 0.7 | 否 | 玄铁鬼将战吼，旗帜猎猎，精英 | Dark iron ghost general battle roar, elite |
| `enemy-boss-roar` | 百目鬼王出场 / 强化回合 | 1.5 | 否 | 百眼齐睁低频咆哮，殿堂震动，Boss 吼叫 | Hundred eyes open low roar, hall trembles, boss roar |
| `enemy-kill-heal` | 无想剑击杀回血等 | 0.7 | 否 | 吸魂回血，击杀奖励生命 | Soul absorb heal, kill reward health |

### 3.8 卡牌市集 / 合成

| ID | 触发时机 | 时长(s) | 循环 | 中文提示词 | English Prompt |
| --- | --- | --- | --- | --- | --- |
| `shop-open` | 打开市集面板 | 0.6 | 否 | 市集木架展开，卡牌上架，商店打开 | Market wooden rack opens cards displayed, shop open |
| `shop-refresh` | 刷新商店 | 0.6 | 否 | 货架翻换卡牌，铜钱叮当，商店刷新 | Shelf cards shuffle copper coins, shop refresh |
| `shop-buy` | 购买卡牌 | 0.5 | 否 | 铜钱付讫 + 卡牌入手，购买成功 | Coins paid card received, purchase success |
| `shop-lock` | 锁定市集 | 0.4 | 否 | 古铜挂锁扣上，市集锁定 | Ancient copper padlock clicks shut, shop locked |
| `shop-unlock` | 解锁市集 | 0.4 | 否 | 挂锁弹开，市集解锁 | Padlock springs open, shop unlocked |
| `shop-cant-buy` | 金币不足 | 0.3 | 否 | 空钱袋闷响，金币不足 | Empty coin pouch dull thud, insufficient gold |
| `merge-auto` | 自动合成升星 | 1.0 | 否 | 三张卡化作鎏光合一，升星合成 | Three cards merge into gilt light, star upgrade merge |
| `merge-manual` | 手动合成确认 | 1.0 | 否 | 冶炉锻合金属融光，手动合成 | Forge furnace metal fusion glow, manual merge |
| `merge-ult-unlock` | 解锁三星大招提示 | 1.2 | 否 | 鎏金古篆亮起，大招解锁，庄严 | Ancient gilt script ignites, ultimate unlocked, solemn |
| `merge-toast` | 合成成功 Toast | 0.8 | 否 | 合成成功庆祝短音，金光碎片 | Merge success celebration short, gold shard burst |

### 3.9 宝物系统

| ID | 触发时机 | 时长(s) | 循环 | 中文提示词 | English Prompt |
| --- | --- | --- | --- | --- | --- |
| `treasure-reveal` | 过关后出现三选一 | 1.0 | 否 | 散落宝物浮现，灵光绕圈，宝物现身 | Scattered relics emerge spiritual light swirls, treasure reveal |
| `treasure-hover` | 悬停宝物卡 | 0.3 | 否 | 宝物灵光轻颤，悬停 | Relic spiritual light tremble, hover |
| `treasure-pick-common` | 选择凡品宝物 | 0.7 | 否 | 灰边凡品入手，平淡灵光，凡品宝物 | Grey-border common relic taken, plain glow, common treasure |
| `treasure-pick-uncommon` | 选择灵品 | 0.7 | 否 | 苍绿灵光注入，灵品宝物 | Olive spiritual light infuses, uncommon treasure |
| `treasure-pick-rare` | 选择宝器 | 0.8 | 否 | 鎏金宝光爆发，宝器宝物 | Gilt radiance burst, rare treasure |
| `treasure-pick-cursed` | 选择咒物 | 1.0 | 否 | 血红符咒缠身，福祸相依，咒物宝物 | Blood-red curse talisman wraps, cursed treasure |
| `treasure-skip` | 放弃宝物 | 0.5 | 否 | 宝物化作鬼雾散去，放弃 | Relic dissolves into ghost mist, treasure skipped |
| `treasure-passive` | 宝物回合初效果（产金/掉血等） | 0.5 | 否 | 宝物被动触发嗡鸣，咒物或祝福 | Relic passive trigger hum, blessing or curse |
| `treasure-curse-hurt` | 咒物回合初扣血 | 0.6 | 否 | 咒物反噬刺痛，生命被夺 | Curse backlash sting, life drained by curse |

### 3.10 过关 / 休整

| ID | 触发时机 | 时长(s) | 循环 | 中文提示词 | English Prompt |
| --- | --- | --- | --- | --- | --- |
| `floor-clear` | 本层敌人全灭 | 1.0 | 否 | 战局平息鬼雾退散，层间胜利短乐 | Battle settles ghost mist retreats, floor clear short win |
| `rest-enter` | 进入层间休整市集 | 1.2 | 否 | 古寺篝火噼啪，休整驿站，过关休整 | Ancient temple campfire crackle, rest station, floor rest |
| `rest-heal` | 休整回血 | 0.8 | 否 | 汤镬热气疗愈，休整回血 | Healing broth steam warmth, rest heal |
| `floor-advance` | 前往下一层 | 0.8 | 否 | 踏上传鬼路，层数推进 | Step onto ghost path, floor advance |
| `final-floor` | 进入第 10 层 | 1.5 | 否 | 终极鬼殿大门洞开，压迫低频，最终层 | Ultimate ghost hall gates open, oppressive low tone, final floor |

### 3.11 胜负结算

| ID | 触发时机 | 时长(s) | 循环 | 中文提示词 | English Prompt |
| --- | --- | --- | --- | --- | --- |
| `result-win` | 通关胜利（凯旋） | 2.0 | 否 | 凯旋锣鼓点 + 剑鸣，庄重胜利，非喜庆过度 | Triumph drums plus sword ring, solemn victory not overly festive |
| `result-win-stinger` | 胜利界面短 stinger | 1.5 | 否 | 朱砂印章「凯旋」落印，胜利 stinger | Cinnabar seal triumph stamp, victory stinger |
| `result-lose` | 失败（陨落） | 2.0 | 否 | 战鼓止 + 断弦，悲壮陨落 | War drums stop broken string, tragic defeat fall |
| `result-lose-stinger` | 失败界面短 stinger | 1.5 | 否 | 血色墨迹「陨落」滴落，失败 stinger | Blood ink fall stamp, defeat stinger |
| `unlock-class` | 解锁新职业（进度） | 1.5 | 否 | 封印符剥落，新职业解锁庆祝 | Seal talisman peels off, new class unlocked celebration |

### 3.12 背景音乐 BGM（循环）

| ID | 触发时机 | 时长(s) | 循环 | 中文提示词 | English Prompt |
| --- | --- | --- | --- | --- | --- |
| `bgm-home` | 首页 | 60–120 | **是** | 静谧鬼域前夜，古筝独奏留白多，暗色氛围，无人声，可循环 | Quiet haunted eve, solo guzheng with space, dark mood, no vocals, seamless loop |
| `bgm-class` | 选职业 | 60–90 | **是** | 出征前压抑蓄势，低音鼓点稀疏，古筝，选职业背景 | Pre-battle tension sparse low drums guzheng, class select background loop |
| `bgm-battle` | 普通战斗 | 90–120 | **是** | 国风暗黑普通战 BGM，慢中板，古筝+低音鼓+鬼风铃，压迫不吵，可循环 | Dark Chinese normal battle BGM mid-slow guzheng low drums ghost bells, loop |
| `bgm-battle-elite` | 精英层战斗 | 90–120 | **是** | 精英战 BGM，不祥弦乐 + 重鼓，比普战紧张，可循环 | Elite battle BGM ominous strings heavy drums tenser than normal, loop |
| `bgm-battle-boss` | 第 10 层 Boss | 120–180 | **是** | Boss 百目鬼王战，低沉合唱垫无歌词+重鼓+诡异脉冲，史诗压迫，可循环 | Boss hundred-eye demon king battle, wordless choir bed heavy drums eerie pulse epic, loop |
| `bgm-shop` | 休整市集（可选） | 60–90 | **是** | 层间市集轻松些，篝火旁木鱼轻点，仍带鬼气，可循环 | Floor rest market slightly calmer campfire wood fish still haunted, loop |
| `bgm-treasure` | 宝物三选一（可选） | 45–60 | **是** | 神秘宝物浮现，悬铃 + 低音，神秘抉择，可循环 | Mysterious relics appear hanging bells plus bass, treasure pick loop |
| `bgm-victory` | 胜利结算界面 | 30–45 | 否 | 凯旋短曲，锣鼓古筝，30 秒胜利曲 | Triumph short piece drums guzheng, 30s victory music |
| `bgm-defeat` | 失败结算界面 | 30–45 | 否 | 陨落短曲，低沉弦 + 断鼓，30 秒失败曲 | Fall short piece low strings broken drums, 30s defeat music |

### 3.13 环境氛围（可选叠层）

| ID | 触发时机 | 时长(s) | 循环 | 中文提示词 | English Prompt |
| --- | --- | --- | --- | --- | --- |
| `ambient-battle` | 普通战场底噪 | 30 | **是** | 远处鬼风低啸，战场环境，极低音量可循环 | Distant ghost wind low howl, battle ambient very subtle loop |
| `ambient-elite` | 精英战场底噪 | 30 | **是** | 磷火飘动噼啪，精英层环境 | Wandering phosphor fire crackle, elite floor ambient loop |
| `ambient-boss` | Boss 战场底噪 | 30 | **是** | 百眼眨动低频脉动 + 血气翻涌，Boss 环境 | Hundred eyes blink low pulse blood mist surge, boss ambient loop |
| `ambient-home` | 首页环境 | 30 | **是** | 极轻夜风 + 远处狼嚎，首页环境 | Very soft night wind distant wolf howl, home ambient loop |

---

## 四、三星大招专属（可选精调，与 `card-ult-hit` 叠层）

| 大招名 | 卡牌 ID | 时长(s) | 中文提示词 | English Prompt |
| --- | --- | --- | --- | --- |
| 破军一闪 | `slash` | 1.0 | 破晓一剑穿透虚空，破军一闪 | Dawn sword pierces void, army breaker flash |
| 天裂斩 | `heavy_slash` | 1.2 | 天空裂痕坠落剑气，天裂斩 | Sky rift sword qi falls, sky rend slash |
| 无想剑 | `focus_strike` | 1.2 | 无想境界一剑，时空凝滞半秒 | No-thought realm single sword, half-second time freeze |
| 千刃风暴 | `whirlwind` | 1.0 | 千道刃风旋风，千刃风暴 | Thousand blade wind cyclone, thousand edge storm |
| 金刚壁 | `guard` | 0.9 | 金刚不坏壁升起，金刚壁 | Vajra indestructible wall rises, vajra wall |
| 回春秘剂 | `heal_potion` | 0.9 | 秘药化春泥复苏，回春秘剂 | Secret elixir spring revival, rejuvenation potion |
| 赤莲咒 | `ember` | 1.0 | 朱砂火莲绽放，赤莲咒 | Cinnabar fire lotus blooms, crimson lotus curse |
| 焚天劫 | `inferno` | 1.5 | 天火劫罚降临，焚天劫 | Heavenly fire tribulation descends, burn heaven calamity |
| 灵域护持 | `ward` | 1.0 | 灵域法阵张开护持，灵域护持 | Spirit domain formation opens protection, spirit domain ward |
| 咒源爆发 | `mana_surge` | 1.0 | 咒力源泉爆发洪流，咒源爆发 | Spell source erupts torrent, curse source burst |
| 穿心刺 | `stab` | 0.8 | 穿心一刺无影，穿心刺 | Heart-piercing stab shadowless, heart pierce |
| 绝命裁断 | `execute` | 1.2 | 绝命刀落裁断魂魄，绝命裁断 | Death sentence blade severs soul, fatal judgment |
| 影隐杀机 | `smoke` | 1.0 | 影中杀机骤现，影隐杀机 | Killing intent emerges from shadow, shadow hidden kill |
| 夜狩终焉 | `backstab` | 1.0 | 月夜狩猎终焉一击，夜狩终焉 | Moonlit hunt final strike, night hunt end |
| 震地锤 | `bash` | 1.0 | 震地锤落土石崩飞，震地锤 | Earth-shaking hammer ground erupts, earth quake hammer |
| 不灭城垣 | `iron_wall` | 1.0 | 长城城垣降世，不灭城垣 | Great wall rampart descends, indestructible rampart |
| 以守为攻 | `riposte` | 1.0 | 盾反一击雷霆，以守为攻 | Shield counter thunder strike, defense as offense |
| 天盾降临 | `fortify` | 1.2 | 天盾从天而降，天盾降临 | Heavenly shield descends from sky, sky shield arrival |

---

## 五、最小可玩集（MVP，约 25 条）

若时间紧，优先生成以下条目即可接入初版：

1. `ui-click`、`ui-confirm`、`ui-deny`
2. `turn-start`、`turn-end`、`draw-card`
3. `card-play`、`fx-slash`、`fx-fire`、`fx-shield`、`fx-heal-potion`
4. `card-ult-hit`、`merge-auto`、`merge-toast`
5. `player-hurt`、`block-gain`、`heal`、`enemy-hurt`、`enemy-death`
6. `shop-buy`、`shop-refresh`、`shop-lock`
7. `treasure-reveal`、`treasure-pick-rare`、`treasure-skip`
8. `floor-clear`、`rest-heal`、`floor-advance`
9. `result-win-stinger`、`result-lose-stinger`
10. `bgm-home`、`bgm-battle`、`bgm-battle-boss`

---

## 六、ElevenLabs 批量示例（Python）

```python
# 需安装 elevenlabs SDK 并设置 ELEVENLABS_API_KEY
from elevenlabs import ElevenLabs
from pathlib import Path

PREFIX = (
    "Dark Chinese ghost folklore game sound effect, charcoal gloom, "
    "dry rice-paper, cinnabar accents, cold gilt metal, solemn not cartoonish, "
    "no melody no vocals, "
)

ITEMS = [
    ("ui-click", "Short dry rice-paper tap click, Chinese UI button, 0.3 seconds", 0.3),
    ("fx-slash", "Single clean Chinese longsword slash, sharp metal sword cut", 0.5),
    # ... 从上表复制
]

client = ElevenLabs()
out = Path("material/audio/sfx")
out.mkdir(parents=True, exist_ok=True)

for name, text, dur in ITEMS:
    audio = client.text_to_sound_effects.convert(
        text=PREFIX + text,
        duration_seconds=dur,
        prompt_influence=0.45,
    )
    with open(out / f"{name}.mp3", "wb") as f:
        for chunk in audio:
            f.write(chunk)
```

---

## 七、游戏内事件映射（接入参考）

| 游戏事件 | 建议音效 ID |
| --- | --- |
| `game.startRun()` | `battle-enter` + `bgm-battle` |
| `game.endTurn()` | `turn-end` → 敌方行动 `enemy-attack` 等 |
| `game.playCard()` | `card-play` + 效果 `fx-*` + 职业 `class-*` |
| 三星大招触发 | `card-ult-charge` + `card-ult-hit` + 大招表 |
| `game.buyCard()` | `shop-buy` |
| `game.refreshShop()` | `shop-refresh` |
| 锁定市集 | `shop-lock` / `shop-unlock` |
| 自动合成 | `merge-auto` + `merge-toast` |
| `game.pickTreasure()` | `treasure-pick-*` |
| 过关 | `floor-clear` → `treasure-reveal` |
| 休整 | `rest-enter` + `rest-heal` |
| `phase === 'victory'` | `result-win-stinger` + `bgm-victory` |
| `phase === 'defeat'` | `result-lose-stinger` + `bgm-defeat` |

---

*文档版本：与 `src/stores/game.js` 战斗流程对齐。接入音效系统时可按此表建 `audioMap`。*
