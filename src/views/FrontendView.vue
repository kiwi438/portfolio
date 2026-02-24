<script setup>
import { ref } from 'vue'
import ProjectCard from '@/components/ProjectCard.vue'
import ProjectModal from '@/components/ProjectModal.vue'
import { frontendProjects } from '../data/frontendProjects'

const selectedProject = ref(null)
</script>

<template>
  <main class="page">
    <h1>Frontend</h1>

    <ProjectCard
      v-for="project in frontendProjects"
      :key="project.id"
      :title="project.title"
      :description="project.description"
      :thumbnail="project.thumbnail"
      @select="selectedProject = project"
    >
      <template #default>
        <div class="tech-stack" v-if="project.stack">
          <span v-for="tech in project.stack" :key="tech">{{ tech }}</span>
        </div>
      </template>
    </ProjectCard>

    <ProjectModal
      v-if="selectedProject"
      :project="selectedProject"
      @close="selectedProject = null"
    />
  </main>
</template>

<style scoped>
.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tech-stack span {
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: -0.01em;
}

.tech-stack span::before {
  content: '●';
  margin-right: 6px;
  color: var(--text-faint);
  font-size: 0.5em;
  position: relative;
  top: -2px;
}
</style>
