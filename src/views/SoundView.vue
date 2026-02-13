<script setup>
import { ref } from 'vue'
import ProjectCard from '@/components/ProjectCard.vue'
import ProjectModal from '@/components/ProjectModal.vue'
import { soundProjects } from '../data/soundProjects'

const selectedProject = ref(null)
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
      :thumbnail="project.thumbnail"
      @select="selectedProject = project"
    />

    <ProjectModal
      v-if="selectedProject"
      :project="selectedProject"
      @close="selectedProject = null"
    />
  </main>
</template>
