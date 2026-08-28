import { copyFileSync } from 'node:fs'

// GitHub Pages 无服务端 rewrite，404 回退 index 以支持 Vue Router
copyFileSync('dist/index.html', 'dist/404.html')
console.log('copied dist/index.html -> dist/404.html')
