<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  project: { type: Object, required: true },
})

const emit = defineEmits(['close']) /* ? */

const modalRef = ref(null)
const previouslyFocused = ref(null)

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
    emit('close')
    return
  }

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

onMounted(() => {
  previouslyFocused.value = document.activeElement /* ? */
  document.body.style.overflow = 'hidden' /* ? */
  document.addEventListener('keydown', trapFocus) /* ? */

  nextTick(() => modalRef.value?.querySelector('.modal-close')?.focus()) /* ? */
})

onUnmounted(() => {
  document.body.style.overflow = '' /* ? */
  document.removeEventListener('keydown', trapFocus) /* ? */
  previouslyFocused.value?.focus()
})
</script>

<template>
  <!-- Teleport??? -->
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div ref="modalRef" class="modal" role="dialog" aria-modal="true" :aria-label="project.title">
        <button class="modal-close" @click="$emit('close')" aria-label="Close">✕</button>

        <h1 class="modal-title">{{ project.title }}</h1>
        <p class="modal-role" v-if="project.role">{{ project.role }}</p>

        <div class="modal-body">
          <div class="modal-info">
            <p class="modal-description">{{ project.description }}</p>

            <div class="modal-tags" v-if="project.tags?.length">
              <h3>Skills</h3>
              <div class="tags">
                <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </div>

          <div class="modal-media" v-if="project.media?.length">
            <template v-for="item in project.media" :key="item.url">
              <div v-if="item.type === 'video'" class="media-item">
                <iframe
                  :src="item.url"
                  :title="item.title || 'Video'"
                  frameborder="0"
                  allowfullscreen
                  loading="lazy"
                ></iframe>
              </div>

              <div v-if="item.type === 'audio'" class="media-item media-audio">
                <p class="media-title">{{ item.title }}</p>
                <audio controls preload="metadata">
                  <source :src="item.url" />
                </audio>
              </div>

              <div v-if="item.type === 'image'" class="media-item">
                <img :src="item.url" :alt="item.title || project.title" loading="lazy" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0; /* ??? */
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 24px;
  overflow-y: auto;
  z-index: 100;
}

/* Сейчас если по инерции прокрутить наверх то backdrop пропадет */
/* Сделать модалку размером как в upwork */

.modal {
  position: relative;
  background: var(--bg);
  max-width: 1320px; /* увеличить */
  width: 100%; /* ??? */
  padding: 48px;
  border-radius: 4px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
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
  margin-right: 40px;
}

.modal-role {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
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
  border-radius: 2px;
}

.modal-media {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.media-item iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 2px;
}

.media-item img {
  width: 100%;
  border-radius: 2px;
}

.media-audio {
  background: var(--border);
  padding: 16px;
  border-radius: 2px;
}

.media-title {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.media-audio audio {
  width: 100%;
}

@media (max-width: 640px) {
  .modal {
    padding: 32px 20px;
  }

  .modal-body {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>
