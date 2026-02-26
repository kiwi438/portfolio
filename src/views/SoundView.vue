<script setup>
import { onMounted, ref } from 'vue'
import ProjectCard from '@/components/ProjectCard.vue'
import ProjectModal from '@/components/ProjectModal.vue'
import { soundProjects } from '../data/soundProjects'

const selectedProject = ref(null)
const hoveredThumbnail = ref(null)

function openProject(project) {
  hoveredThumbnail.value = null
  selectedProject.value = project
}

onMounted(() => {
  soundProjects.forEach((project) => {
    if (project.thumbnail) {
      const img = new Image()
      img.src = project.thumbnail
    }
  })
})
</script>

<template>
  <main class="page">
    <h1>Sound</h1>

    <ProjectCard
      v-for="project in soundProjects"
      :key="project.id"
      :title="project.title"
      :description="project.description"
      :tags="project.tags"
      @select="openProject(project)"
      @mouseenter="hoveredThumbnail = project.thumbnail"
      @mouseleave="hoveredThumbnail = null"
    />

    <Transition name="preview">
      <div v-if="hoveredThumbnail" class="thumbnail-preview" aria-hidden="true">
        <img :src="hoveredThumbnail" alt="" />
      </div>
    </Transition>

    <ProjectModal
      v-if="selectedProject"
      :project="selectedProject"
      @close="selectedProject = null"
    />
  </main>
</template>

<style scoped>
.thumbnail-preview {
  position: fixed;
  right: 50%;
  top: 50%;
  transform: translate(80%, -50%);
  width: 45vw;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--border-radius);
  pointer-events: none;
  z-index: 10;
}

.thumbnail-preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: var(--border-radius);
}

.preview-enter-active {
  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out;
}

.preview-leave-active {
  transition:
    opacity 0.2s ease-in,
    transform 0.2s ease-in;
}

.preview-enter-from {
  opacity: 0;
  transform: translate(80%, -50%) translateX(12px);
}

.preview-leave-to {
  opacity: 0;
  transform: translate(80%, -50%) translateX(8px);
}

@media (max-width: 1440px) {
  .thumbnail-preview {
    width: 35vw;
    transform: translate(130%, -50%);
  }

  .preview-enter-from {
    opacity: 0;
    transform: translate(130%, -50%) translateX(12px);
  }

  .preview-leave-to {
    opacity: 0;
    transform: translate(130%, -50%) translateX(8px);
  }
}

@media (max-width: 1100px) {
  .thumbnail-preview {
    display: none;
  }
}
</style>
