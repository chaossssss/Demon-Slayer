/** 256 空间粒子场：只生成一次，再按物理模拟，避免循环闪点。 */

function rng(seed) {
  let s = (seed >>> 0) || 1
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

function pick(rand, a, b) {
  return rand() < 0.5 ? a : b
}

function orb(p) {
  return { drag: 0.9, delay: 0, sizeEnd: 0.4, additive: true, ax: 0, ay: 0, ...p }
}

export function createFxWorld(tag, ult, facing, seed) {
  const rand = rng(seed)
  const dir = facing === 'left' ? -1 : 1
  const u = ult ? 1.35 : 1
  const particles = []
  const cx = 128
  const cy = 132

  if (tag === 'slash') spawnSlash(particles, rand, cx, cy, dir, u, ult)
  else if (tag === 'fire') spawnFire(particles, rand, cx, cy, u, ult)
  else if (tag === 'heal') spawnHeal(particles, rand, cx, cy, u, ult)
  else if (tag === 'shield') spawnShield(particles, rand, cx, cy, u, ult)
  else if (tag === 'smoke') spawnSmoke(particles, rand, cx, cy, dir, u, ult)

  return { tag, dir, u, ult: !!ult, particles, t: 0 }
}

function spawnSlash(particles, rand, cx, cy, dir, u, ult) {
  particles.push(
    orb({
      kind: 'orb',
      x: cx,
      y: cy,
      vx: 0,
      vy: 0,
      life: 0.14,
      size: 78 * u,
      sizeEnd: 12,
      rgb: ult ? [255, 236, 180] : [255, 244, 210],
    }),
  )

  const nSpark = Math.round(64 * u)
  for (let i = 0; i < nSpark; i++) {
    const a = -1.15 + rand() * 2.15
    const sp = 120 + rand() * 260
    const gold = rand() > 0.38
    particles.push(
      orb({
        kind: 'orb',
        x: cx + Math.cos(a) * 8 * dir,
        y: cy + Math.sin(a) * 6,
        vx: Math.cos(a) * sp * dir,
        vy: Math.sin(a) * sp * 0.48,
        ay: 90 + rand() * 80,
        drag: 0.86,
        life: 0.22 + rand() * 0.32,
        delay: rand() * 0.05,
        size: 2.4 + rand() * 5.5,
        sizeEnd: 0.2,
        rgb: gold ? pick(rand, [255, 232, 170], [201, 162, 39]) : pick(rand, [155, 45, 31], [220, 80, 48]),
      }),
    )
  }

  for (let i = 0; i < Math.round(16 * u); i++) {
    const a = -1.0 + rand() * 1.85
    const sp = 180 + rand() * 200
    particles.push({
      kind: 'streak',
      x: cx,
      y: cy,
      vx: Math.cos(a) * sp * dir,
      vy: Math.sin(a) * sp * 0.38,
      ax: 0,
      ay: 40,
      drag: 0.88,
      life: 0.16 + rand() * 0.16,
      delay: rand() * 0.04,
      size: 22 + rand() * 34,
      sizeEnd: 6,
      thick: 1.1 + rand() * 1.8,
      rot: Math.atan2(Math.sin(a) * 0.38, Math.cos(a) * dir),
      rgb: rand() > 0.5 ? [255, 226, 150] : [201, 162, 39],
      additive: true,
    })
  }

  for (let i = 0; i < 8; i++) {
    particles.push({
      kind: 'wisp',
      x: cx + dir * (36 + rand() * 38),
      y: cy + (rand() - 0.5) * 46,
      vx: dir * (18 + rand() * 36),
      vy: 8 + rand() * 28,
      ax: 0,
      ay: 20,
      drag: 0.94,
      life: 0.32 + rand() * 0.28,
      delay: 0.06 + rand() * 0.1,
      size: 12 + rand() * 18,
      sizeEnd: 26 + rand() * 10,
      rgb: [72, 18, 16],
      additive: false,
      alpha: 0.28,
    })
  }
}

function spawnFire(particles, rand, cx, cy, u, ult) {
  const base = cy + 28
  particles.push(
    orb({
      kind: 'orb',
      x: cx,
      y: base - 6,
      vx: 0,
      vy: -10,
      life: 0.55,
      size: 70 * u,
      sizeEnd: 24,
      rgb: [201, 120, 40],
    }),
  )

  for (let i = 0; i < Math.round(14 * u); i++) {
    particles.push({
      kind: 'flame',
      x: cx + (rand() - 0.5) * 28,
      y: base + rand() * 8,
      vx: (rand() - 0.5) * 18,
      vy: -(70 + rand() * 90),
      ax: 0,
      ay: 20,
      drag: 0.96,
      turb: rand() * 6,
      life: 0.45 + rand() * 0.35,
      delay: rand() * 0.18,
      size: 18 + rand() * 22,
      sizeEnd: 6,
      additive: true,
      rgb: [196, 92, 38],
    })
  }

  for (let i = 0; i < Math.round(48 * u); i++) {
    particles.push(
      orb({
        kind: 'orb',
        x: cx + (rand() - 0.5) * 22,
        y: base - rand() * 10,
        vx: (rand() - 0.5) * 40,
        vy: -(80 + rand() * 140),
        ay: 30,
        drag: 0.93,
        life: 0.4 + rand() * 0.5,
        delay: rand() * 0.28,
        size: 1.8 + rand() * 3.6,
        sizeEnd: 0.4,
        rgb: rand() > 0.55 ? [255, 220, 130] : pick(rand, [201, 162, 39], [155, 45, 31]),
      }),
    )
  }

  for (let i = 0; i < 7; i++) {
    particles.push({
      kind: 'wisp',
      x: cx + (rand() - 0.5) * 20,
      y: base - 8,
      vx: (rand() - 0.5) * 16,
      vy: -(24 + rand() * 30),
      ax: 0,
      ay: 0,
      drag: 0.97,
      life: 0.55 + rand() * 0.3,
      delay: 0.12 + rand() * 0.2,
      size: 14 + rand() * 16,
      sizeEnd: 28,
      rgb: ult ? [60, 22, 18] : [40, 22, 18],
      additive: false,
      alpha: 0.22,
    })
  }
}

function spawnHeal(particles, rand, cx, cy, u, ult) {
  particles.push(
    orb({
      kind: 'orb',
      x: cx,
      y: cy,
      vx: 0,
      vy: 0,
      life: 0.45,
      size: 64 * u,
      sizeEnd: 86 * u,
      rgb: [180, 210, 160],
    }),
  )

  for (let i = 0; i < Math.round(36 * u); i++) {
    const a = rand() * Math.PI * 2
    const r = 8 + rand() * 26
    particles.push(
      orb({
        kind: 'orb',
        x: cx + Math.cos(a) * r,
        y: cy + 22 + Math.sin(a) * 8,
        vx: (rand() - 0.5) * 14,
        vy: -(28 + rand() * 55),
        drag: 0.97,
        life: 0.7 + rand() * 0.4,
        delay: rand() * 0.22,
        size: 2.2 + rand() * 4.2,
        sizeEnd: 0.6,
        rgb: rand() > 0.45 ? [201, 162, 39] : pick(rand, [142, 196, 168], [217, 203, 179]),
      }),
    )
  }

  for (let i = 0; i < Math.round(8 * u); i++) {
    const a = rand() * Math.PI * 2
    particles.push({
      kind: 'talisman',
      x: cx + Math.cos(a) * 16,
      y: cy + 18,
      vx: (rand() - 0.5) * 18,
      vy: -(22 + rand() * 36),
      ax: 0,
      ay: -8,
      drag: 0.98,
      rot: rand() * Math.PI,
      rotV: (rand() - 0.5) * 3.2,
      life: 0.75 + rand() * 0.3,
      delay: 0.04 + rand() * 0.2,
      size: 7 + rand() * 5,
      sizeEnd: 7,
      additive: false,
      rgb: [217, 203, 179],
    })
  }

  for (let i = 0; i < 10; i++) {
    particles.push({
      kind: 'plus',
      x: cx + (rand() - 0.5) * 50,
      y: cy + (rand() - 0.5) * 40,
      vx: 0,
      vy: -(10 + rand() * 18),
      ax: 0,
      ay: 0,
      drag: 1,
      life: 0.35 + rand() * 0.2,
      delay: 0.08 + rand() * 0.35,
      size: 4 + rand() * 4,
      sizeEnd: 7,
      additive: true,
      rgb: [201, 162, 39],
    })
  }
}

function spawnShield(particles, rand, cx, cy, u, ult) {
  particles.push(
    orb({
      kind: 'orb',
      x: cx,
      y: cy,
      vx: 0,
      vy: 0,
      life: 0.28,
      size: 20,
      sizeEnd: 78 * u,
      rgb: [201, 176, 90],
    }),
  )

  for (let i = 0; i < 14; i++) {
    const a = (Math.PI * 2 * i) / 14
    particles.push({
      kind: 'orb',
      x: cx + Math.cos(a) * 34,
      y: cy + Math.sin(a) * 38,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      orbit: true,
      cx,
      cy,
      radius: 34 + rand() * 6,
      radiusV: 18 + rand() * 14,
      angle: a,
      angV: 1.6 + rand() * 1.2,
      drag: 1,
      life: 0.7 + rand() * 0.18,
      delay: rand() * 0.08,
      size: 2.4 + rand() * 2.2,
      sizeEnd: 0.6,
      additive: true,
      rgb: i % 2 ? [201, 162, 39] : [142, 180, 201],
    })
  }

  for (let i = 0; i < Math.round(18 * u); i++) {
    const a = rand() * Math.PI * 2
    particles.push(
      orb({
        kind: 'orb',
        x: cx + Math.cos(a) * 30,
        y: cy + Math.sin(a) * 34,
        vx: Math.cos(a) * (20 + rand() * 40),
        vy: Math.sin(a) * (20 + rand() * 40),
        drag: 0.9,
        life: 0.28 + rand() * 0.22,
        delay: 0.04 + rand() * 0.12,
        size: 2 + rand() * 3,
        rgb: [255, 232, 170],
      }),
    )
  }
}

function spawnSmoke(particles, rand, cx, cy, dir, u, ult) {
  for (let i = 0; i < Math.round(16 * u); i++) {
    const purple = rand() > 0.45
    particles.push({
      kind: 'wisp',
      x: cx + (rand() - 0.5) * 18,
      y: cy + (rand() - 0.5) * 16,
      vx: dir * (18 + rand() * 42) + (rand() - 0.5) * 12,
      vy: -(16 + rand() * 34),
      ax: dir * 8,
      ay: -6,
      drag: 0.97,
      turb: rand() * 5,
      life: 0.7 + rand() * 0.4,
      delay: rand() * 0.16,
      size: 16 + rand() * 22,
      sizeEnd: 38 + rand() * 22,
      rgb: purple ? [72, 48, 86] : pick(rand, [36, 28, 24], [52, 44, 40]),
      additive: false,
      alpha: 0.38 + rand() * 0.12,
    })
  }

  for (let i = 0; i < 22; i++) {
    particles.push(
      orb({
        kind: 'orb',
        x: cx,
        y: cy,
        vx: dir * (30 + rand() * 70) + (rand() - 0.5) * 20,
        vy: -(20 + rand() * 50),
        drag: 0.94,
        life: 0.45 + rand() * 0.35,
        delay: rand() * 0.2,
        size: 1.4 + rand() * 2.2,
        sizeEnd: 0.3,
        rgb: rand() > 0.65 ? [201, 162, 39] : [180, 160, 140],
        additive: rand() > 0.5,
      }),
    )
  }
}

export function stepFxWorld(world, dt) {
  world.t += dt
  const list = world.particles
  for (let i = 0; i < list.length; i++) {
    const p = list[i]
    if (p.delay > 0) {
      p.delay -= dt
      continue
    }
    p.age = (p.age || 0) + dt
    if (p.orbit) {
      p.angle += p.angV * dt
      p.radius += p.radiusV * dt
      p.x = p.cx + Math.cos(p.angle) * p.radius
      p.y = p.cy + Math.sin(p.angle) * p.radius * 1.12
    } else {
      if (p.turb != null) p.x += Math.sin(p.age * 9 + p.turb) * 28 * dt
      p.vx += (p.ax || 0) * dt
      p.vy += (p.ay || 0) * dt
      const drag = p.drag ?? 0.92
      const d = drag ** (dt * 60)
      p.vx *= d
      p.vy *= d
      p.x += p.vx * dt
      p.y += p.vy * dt
    }
    if (p.rotV) p.rot = (p.rot || 0) + p.rotV * dt
  }
}

function lifeK(p) {
  if (p.delay > 0) return 0
  const age = p.age || 0
  if (age >= p.life) return 0
  const t = age / p.life
  const fadeIn = Math.min(1, age / 0.05)
  const fadeOut = t > 0.55 ? 1 - (t - 0.55) / 0.45 : 1
  return Math.max(0, fadeIn * fadeOut)
}

function sizeOf(p) {
  const t = Math.min(1, (p.age || 0) / p.life)
  return p.size + (p.sizeEnd - p.size) * t
}

function drawOrb(ctx, x, y, r, rgb, a) {
  if (a <= 0.01 || r <= 0.3) return
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, `rgba(255,255,255,${Math.min(1, a)})`)
  g.addColorStop(0.16, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a * 0.92})`)
  g.addColorStop(0.48, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a * 0.28})`)
  g.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`)
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

function drawSlashRibbon(ctx, world) {
  const t = world.t
  const sweep = 1 - (1 - Math.min(1, t / 0.22)) ** 3
  const fade = t < 0.12 ? t / 0.12 : Math.max(0, 1 - (t - 0.12) / 0.42)
  if (fade <= 0) return
  const cx = 128
  const cy = 132
  const dir = world.dir
  const start = -2.35
  const end = start + 3.05 * sweep
  const rInner = 22 * world.u
  const rOuter = 92 * world.u

  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(dir, 1)
  ctx.globalCompositeOperation = 'lighter'

  const layers = [
    { inner: rInner - 10, outer: rOuter + 16, a: 0.18 * fade, rgb: [155, 45, 31], blur: 0 },
    { inner: rInner, outer: rOuter, a: 0.55 * fade, rgb: [201, 162, 39], blur: 0 },
    { inner: rInner + 10, outer: rOuter - 14, a: 0.9 * fade, rgb: [255, 236, 196], blur: 0 },
  ]

  for (const layer of layers) {
    ctx.beginPath()
    for (let a = start; a <= end; a += 0.05) {
      const x = Math.cos(a) * layer.outer
      const y = Math.sin(a) * layer.outer * 0.7
      if (a === start) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    for (let a = end; a >= start; a -= 0.05) {
      const x = Math.cos(a) * layer.inner
      const y = Math.sin(a) * layer.inner * 0.7
      ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fillStyle = `rgba(${layer.rgb[0]},${layer.rgb[1]},${layer.rgb[2]},${layer.a})`
    ctx.fill()
  }

  ctx.lineWidth = 1.4 * world.u
  ctx.strokeStyle = `rgba(255,255,240,${0.75 * fade})`
  ctx.beginPath()
  ctx.arc(0, 0, (rInner + rOuter) * 0.5, start, end)
  ctx.stroke()
  ctx.restore()
}

function drawFireBase(ctx, world) {
  const t = world.t
  const fade = t < 0.12 ? t / 0.12 : Math.max(0, 1 - (t - 0.12) / 0.7)
  if (fade <= 0) return
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  drawOrb(ctx, 128, 158, 56 * world.u, [201, 92, 36], 0.42 * fade)
  drawOrb(ctx, 128, 150, 28 * world.u, [255, 220, 140], 0.35 * fade)
  ctx.restore()
}

function drawHealRings(ctx, world) {
  const t = world.t
  for (let i = 0; i < 3; i++) {
    const local = t - i * 0.12
    if (local < 0) continue
    const k = Math.min(1, local / 0.7)
    const fade = (1 - k) * (i === 0 ? 0.85 : 0.45)
    const r = (18 + k * 58) * world.u
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.strokeStyle = i === 1 ? `rgba(201,162,39,${fade})` : `rgba(120,170,140,${fade})`
    ctx.lineWidth = 1.6 - i * 0.3
    ctx.beginPath()
    ctx.ellipse(128, 132, r * 0.86, r, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
}

function drawShieldGeom(ctx, world) {
  const t = world.t
  const appear = 1 - (1 - Math.min(1, t / 0.16)) ** 3
  const fade = t < 0.2 ? 1 : Math.max(0, 1 - (t - 0.2) / 0.62)
  if (fade <= 0) return
  const r = (36 + appear * 18) * world.u
  ctx.save()
  ctx.translate(128, 132)
  ctx.globalCompositeOperation = 'lighter'

  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 8 + (i * Math.PI) / 4
    const x = Math.cos(a) * r * 0.86
    const y = Math.sin(a) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = `rgba(201,162,39,${0.08 * fade})`
  ctx.fill()
  ctx.lineWidth = 2.4 * world.u
  ctx.strokeStyle = `rgba(201,162,39,${0.8 * fade})`
  ctx.stroke()
  ctx.lineWidth = 1
  ctx.strokeStyle = `rgba(230,240,255,${0.55 * fade})`
  ctx.stroke()

  ctx.lineWidth = 1.2
  ctx.strokeStyle = `rgba(142,180,201,${0.35 * fade})`
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 8 + (i * Math.PI) / 4
    const x = Math.cos(a) * r * 0.7
    const y = Math.sin(a) * r * 0.82
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.stroke()
  ctx.restore()
}

function drawParticle(ctx, p) {
  const k = lifeK(p)
  if (k <= 0) return
  const s = sizeOf(p)
  const rgb = p.rgb
  if (p.kind === 'orb' || p.kind === 'flame') {
    ctx.save()
    if (p.additive !== false) ctx.globalCompositeOperation = 'lighter'
    if (p.kind === 'flame') {
      drawOrb(ctx, p.x, p.y, s * 0.7, [155, 45, 31], 0.4 * k)
      drawOrb(ctx, p.x, p.y - s * 0.18, s * 0.48, [196, 92, 38], 0.65 * k)
      drawOrb(ctx, p.x, p.y - s * 0.34, s * 0.22, [255, 226, 150], 0.9 * k)
    } else {
      drawOrb(ctx, p.x, p.y, s, rgb, k)
    }
    ctx.restore()
    return
  }
  if (p.kind === 'streak') {
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot || 0)
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createLinearGradient(-s / 2, 0, s / 2, 0)
    g.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`)
    g.addColorStop(0.5, `rgba(255,244,210,${0.95 * k})`)
    g.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`)
    ctx.fillStyle = g
    const h = (p.thick || 1.6) * k
    ctx.fillRect(-s / 2, -h / 2, s, h)
    ctx.restore()
    return
  }
  if (p.kind === 'wisp') {
    ctx.save()
    ctx.globalCompositeOperation = p.additive ? 'lighter' : 'source-over'
    const a = (p.alpha ?? 0.35) * k
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, s)
    g.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`)
    g.addColorStop(0.45, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a * 0.45})`)
    g.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(p.x, p.y, s * 1.2, s * 0.82, (p.rot || 0.3), 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    return
  }
  if (p.kind === 'talisman') {
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot || 0)
    ctx.globalAlpha = 0.85 * k
    ctx.fillStyle = '#d9cbb3'
    ctx.strokeStyle = '#c9a227'
    ctx.lineWidth = 0.8
    ctx.fillRect(-s * 0.38, -s * 0.7, s * 0.76, s * 1.4)
    ctx.strokeRect(-s * 0.38, -s * 0.7, s * 0.76, s * 1.4)
    ctx.strokeStyle = '#9b2d1f'
    ctx.beginPath()
    ctx.moveTo(-s * 0.12, -s * 0.35)
    ctx.lineTo(s * 0.1, s * 0.32)
    ctx.moveTo(-s * 0.18, s * 0.05)
    ctx.lineTo(s * 0.18, -s * 0.08)
    ctx.stroke()
    ctx.restore()
    return
  }
  if (p.kind === 'plus') {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = k
    ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
    ctx.fillRect(p.x - s, p.y - 0.8, s * 2, 1.6)
    ctx.fillRect(p.x - 0.8, p.y - s, 1.6, s * 2)
    ctx.restore()
  }
}

export function drawFxWorld(ctx, world, w, h) {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, w, h)
  ctx.setTransform(w / 256, 0, 0, h / 256, 0, 0)

  if (world.tag === 'slash') drawSlashRibbon(ctx, world)
  if (world.tag === 'fire') drawFireBase(ctx, world)
  if (world.tag === 'heal') drawHealRings(ctx, world)
  if (world.tag === 'shield') drawShieldGeom(ctx, world)

  const list = world.particles
  for (let i = 0; i < list.length; i++) drawParticle(ctx, list[i])
}
