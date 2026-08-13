import { defineStore } from 'pinia'
import { CLASSES } from '@/data/gameData'

const STORAGE_KEY = 'demonslayer_progress'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return {
    unlocked: ['swordsman'],
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
      const next = new Set(this.unlocked)
      for (const c of Object.values(CLASSES)) {
        if (next.has(c.id)) continue
        const u = c.unlock
        if (u.type === 'default') next.add(c.id)
        if (u.type === 'floors' && this.bestFloor >= u.value) next.add(c.id)
        if (u.type === 'wins' && this.wins >= u.value) next.add(c.id)
      }
      this.unlocked = [...next]
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
