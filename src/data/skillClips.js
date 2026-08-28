import { publicAsset } from '@/utils/publicAsset'

function clipBase(classId, cardId, star = 1) {
  const ult = Number(star) >= 3 ? '-ult' : ''
  return `/skills/${classId || 'swordsman'}/${cardId}${ult}`
}

/** 按优先级：三星大招 webm/mp4 → 普通技 webm/mp4。由播放器自行试播，不再 HEAD 探测。 */
export function skillClipCandidates(classId, cardId, star = 1) {
  if (!cardId) return []
  const list = []
  if (Number(star) >= 3) {
    list.push(
      publicAsset(`${clipBase(classId, cardId, 3)}.mp4`),
      publicAsset(`${clipBase(classId, cardId, 3)}.webm`),
    )
  }
  list.push(
    publicAsset(`${clipBase(classId, cardId, 1)}.mp4`),
    publicAsset(`${clipBase(classId, cardId, 1)}.webm`),
  )
  return [...new Set(list)]
}

export function findSkillClip(classId, cardId, star = 1) {
  return Promise.resolve(skillClipCandidates(classId, cardId, star)[0] || null)
}
