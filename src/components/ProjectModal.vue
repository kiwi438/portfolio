<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { detectPlatform } from '@/data/platforms'
import AudioPlayer from '@/components/AudioPlayer.vue'

const props = defineProps({
  project: { type: Object, required: true },
})

const emit = defineEmits(['close']) /* ? */

const visible = ref(false) /* ? */
const modalRef = ref(null)
const previouslyFocused = ref(null)
const contentReady = ref(false)

function getFocusableElement() {
  if (!modalRef.value) return []

  return [
    ...modalRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ] /* ? */
}

function trapFocus(e) {
  if (e.key === 'Escape') {
    close()
    return
  } /* ? */
  if (e.key !== 'Tab') return /* ? */

  const focusable = getFocusableElement() /* ? */
  if (!focusable.length) return /* ? */

  const first = focusable[0] /* ? */
  const last = focusable[focusable.length - 1] /* ? */

  if (e.shiftKey && document.activeElement === first) {
    /* ? */
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    /* ? */
    e.preventDefault()
    first.focus()
  }
}

function close() {
  visible.value = false
}

function onAfterLeave() {
  document.body.style.overflow = '' /* ? */
  document.removeEventListener('keydown', trapFocus) /* ? */
  previouslyFocused.value?.focus() /* ? */
  emit('close') /* ? */
}

onMounted(() => {
  previouslyFocused.value = document.activeElement /* ? */
  document.body.style.overflow = 'hidden' /* ? */
  document.addEventListener('keydown', trapFocus) /* ? */
  visible.value = true /* ? */
  requestAnimationFrame(() => {
    contentReady.value = true
  })
  nextTick(() => modalRef.value?.querySelector('.modal-close')?.focus()) /* ? */
})

onUnmounted(() => {
  document.body.style.overflow = '' /* ? */
  document.removeEventListener('keydown', trapFocus) /* ? */
  previouslyFocused.value?.focus()
})
</script>

<template>
  <!-- Teleport -->
  <Teleport to="body">
    <Transition name="modal" @after-leave="onAfterLeave">
      <div v-if="visible" class="modal-backdrop" @click.self="close">
        <div
          ref="modalRef"
          class="modal"
          role="dialog"
          aria-modal="true"
          :aria-label="project.title"
        >
          <button class="modal-close" @click="close" aria-label="Close">✕</button>

          <div class="modal-body">
            <div class="modal-info">
              <h1 class="modal-title">{{ project.title }}</h1>
              <p class="modal-role" v-if="project.role">{{ project.role }}</p>
              <p class="modal-description">{{ project.description }}</p>

              <div class="modal-tags" v-if="project.tags?.length">
                <h3>Skills</h3>
                <div class="tags">
                  <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
                </div>
              </div>
            </div>

            <div class="modal-media" v-if="contentReady && project.media?.length">
              <template v-for="item in project.media" :key="item.url">
                <!-- Video -->
                <div v-if="item.type === 'video'" class="media-item">
                  <iframe
                    :src="item.url"
                    :title="item.title || 'Video'"
                    frameborder="0"
                    allowfullscreen
                    loading="lazy"
                  ></iframe>
                </div>

                <!-- Audio -->
                <AudioPlayer v-if="item.type === 'audio'" :src="item.url" :title="item.title" />

                <!-- Image -->
                <div v-if="item.type === 'image'" class="media-item">
                  <img
                    :src="item.url"
                    :alt="item.title || project.title"
                    loading="lazy"
                    @load="$event.target.classList.add('loaded')"
                  />
                </div>

                <!-- Link -->
                <template v-if="item.type === 'link'">
                  <a
                    :href="item.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="media-item media-link"
                    :style="{ '--platform-color': detectPlatform(item.url, item.platform).color }"
                  >
                    <span class="link-icon">{{
                      detectPlatform(item.url, item.platform).icon
                    }}</span>
                    <span class="link-content">
                      <span class="link-title">{{ item.title }}</span>
                      <span class="link-platform">{{
                        detectPlatform(item.url, item.platform).label
                      }}</span>
                    </span>
                    <span class="link-arrow">↗</span>
                  </a>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.media-item img {
  width: 100%;
  border-radius: var(--border-radius);
  aspect-ratio: 16 / 9;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.media-item img.loaded {
  opacity: 1;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease-in-out;
  will-change: opacity;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition:
    opacity 0.2s ease-in-out,
    transform 0.2s ease-in-out;
  will-change: opacity, transform;
}

.modal-enter-from .modal {
  opacity: 0;
  transform: translateY(10px);
}

.modal-leave-to .modal {
  opacity: 0;
  transform: translateY(6px);
}

.modal-backdrop {
  position: fixed;
  inset: 0; /* ??? */
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 24px;
  z-index: 100;
}

/* Сейчас если по инерции прокрутить наверх то backdrop пропадет */
/* Сделать модалку размером как в upwork */

.modal {
  position: relative;
  background: var(--bg);
  max-width: 1320px; /* увеличить */
  width: 100%; /* ??? */
  padding: 0;
  border-radius: var(--border-radius);

  height: calc(100svh - 96px);
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 8px;
  line-height: 1;
  transition: color 0.2s ease-in-out;
}

.modal-close:hover {
  color: var(--text);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.modal-role {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 48px;
  align-items: start;

  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 48px;
}

.modal-description {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.modal-tags h3 {
  font-size: 0.75rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-faint);
  margin-bottom: 12px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags span {
  font-size: 0.8rem;
  color: var(--text);
  border: 1px solid var(--border);
  padding: 4px 12px;
  border-radius: var(--border-radius);
}

.modal-info {
  position: sticky;
  top: 0;
}

.modal-media {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.media-item iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--border-radius);
}

.media-item img {
  width: 100%;
  border-radius: var(--border-radius);
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.media-item img,
.card-thumbnail {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.media-item img [complete],
.card-thumbnail[complete] {
  opacity: 1;
}

.media-audio {
  background: var(--border);
  padding: 16px;
  border-radius: var(--border-radius);
}

.media-title {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.media-audio audio {
  width: 100%;
}

.media-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  text-decoration: none;
  color: var(--text);
  transition: border-color 0.2s ease-in-out;
}

.media-link:hover {
  border-color: var(--platform-color);
}

.link-icon {
  font-size: 1.25rem;
  color: var(--platform-color);
  flex-shrink: 0;
}

.link-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.link-title {
  font-size: 0.875rem;
  font-weight: 500;
}

.link-platform {
  font-size: 0.75rem;
  color: var(--platform-color);
}

.link-arrow {
  margin-left: auto;
  color: var(--text-faint);
  flex-shrink: 0;
  transition: color 0.2s ease-in-out;
}

.media-link:hover .link-arrow {
  color: var(--platform-color);
}

@media (max-width: 640px) {
  .modal {
    height: auto;
    max-height: calc(100svh - 48px);
  }

  .modal-body {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 32px 20px;
    overflow-y: auto;
  }

  .modal-info {
    position: static;
  }
}
</style>
