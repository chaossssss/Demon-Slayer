import { defineStore } from 'pinia'
import { CLASSES } from '@/data/gameData'

const STORAGE_KEY = 'demonslayer_progress'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      // 测试期：强制全职业可用
      data.unlocked = Object.keys(CLASSES)
      return data
    }
  } catch {
    /* ignore */
  }
  return {
    unlocked: Object.keys(CLASSES),
    wins: 0,
    bestFloor: 0,
    totalRuns: 0,
  }
}

export const useProgressStore = defineStore('progress', {
  state: () => load(),
  getters: {
    classes(state) {
      return Object.values(CLASSES).map((c) => ({
        ...c,
        unlocked: state.unlocked.includes(c.id),
        unlockHint: unlockHint(c, state),
      }))
    },
  },
  actions: {
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          unlocked: this.unlocked,
          wins: this.wins,
          bestFloor: this.bestFloor,
          totalRuns: this.totalRuns,
        }),
      )
    },
    recordRun({ floor, won }) {
      this.totalRuns += 1
      this.bestFloor = Math.max(this.bestFloor, floor)
      if (won) this.wins += 1
      this.checkUnlocks()
      this.persist()
    },
    checkUnlocks() {
      // 测试期：始终全解锁
      this.unlocked = Object.keys(CLASSES)
    },
  },
})

function unlockHint(c, state) {
  if (state.unlocked.includes(c.id)) return '已解锁'
  const u = c.unlock
  if (u.type === 'floors') return `抵达第 ${u.value} 层解锁（当前最高 ${state.bestFloor}）`
  if (u.type === 'wins') return `通关 ${u.value} 次解锁（当前 ${state.wins}）`
  return ''
}
