<script setup>
import { ref, onUnmounted } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  title: { type: String, default: '' },
})

const audio = ref(null)
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const dragging = ref(false)
let rafId = null

function tick() {
  if (audio.value && playing.value && !dragging.value) {
    currentTime.value = audio.value.currentTime
  }
  if (playing.value) rafId = requestAnimationFrame(tick)
}

function toggle() {
  if (!audio.value) return
  if (playing.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
}

function onPlay() {
  playing.value = true
  rafId = requestAnimationFrame(tick)
}

function onPause() {
  playing.value = false
  if (rafId) cancelAnimationFrame(rafId)
  rafId = null
}

function onLoadedMetadata() {
  duration.value = audio.value.duration
}

function onEnded() {
  playing.value = false
  currentTime.value = 0
  if (rafId) cancelAnimationFrame(rafId)
  rafId = null
}

const playerRef = ref(null)

function seek(e) {
  if (!playerRef.value || !duration.value) return
  const rect = playerRef.value.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  audio.value.currentTime = ratio * duration.value
  currentTime.value = audio.value.currentTime
}

function onPointerDown(e) {
  if (e.target.closest('.play-btn')) return
  dragging.value = true
  seek(e)
  const onMove = (ev) => seek(ev)
  const onUp = () => {
    dragging.value = false
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  }
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}

function fmt(s) {
  if (!s || !isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const progress = () => (duration.value ? (currentTime.value / duration.value) * 100 : 0)

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (audio.value) audio.value.pause()
})
</script>

<template>
  <div
    ref="playerRef"
    class="audio-player"
    :style="{
      background: `linear-gradient(to right, rgba(255,255,255,0.15) ${progress()}%, var(--border) ${progress()}%)`,
    }"
    @pointerdown="onPointerDown"
  >
    <audio
      ref="audio"
      :src="src"
      preload="metadata"
      @loadedmetadata="onLoadedMetadata"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
    />

    <button class="play-btn" @click="toggle" :aria-label="playing ? 'Pause' : 'Play'">
      <!-- Play -->
      <svg v-if="!playing" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4 2.5v11l9-5.5z" />
      </svg>
      <!-- Pause -->
      <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="3" y="2" width="3.5" height="12" rx="0.5" />
        <rect x="9.5" y="2" width="3.5" height="12" rx="0.5" />
      </svg>
    </button>

    <span class="time">{{ fmt(currentTime) }}</span>
    <span class="time time-total">{{ fmt(duration) }}</span>

    <p v-if="title" class="player-title">{{ title }}</p>
  </div>
</template>

<style scoped>
.audio-player {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--border);
  border-radius: 2px;
  cursor: pointer;
  touch-action: none;
  user-select: none;
}

.play-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--text-faint);
  border-radius: 50%;
  color: var(--text);
  cursor: pointer;
  transition: border-color 0.2s;
  flex-shrink: 0;
}

.play-btn:hover {
  border-color: var(--text);
}

.time {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  min-width: 2.5em;
}

.time-total {
  margin-left: auto;
}

.player-title {
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
