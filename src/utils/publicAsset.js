/** public/ 目录资源 URL（兼容 GitHub Pages 子路径 base） */
export function publicAsset(path) {
  const clean = String(path || '').replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${clean}`
}
