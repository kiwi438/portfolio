<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: Array, default: () => [] },
  status: { type: String, default: '' },
  thumbnail: String,
})

defineEmits(['select'])
</script>

<template>
  <article class="card" @click="$emit('select')">
    <div class="card-content">
      <h2>{{ title }}</h2>
      <span v-if="status" class="status">{{ status }}</span>
      <p>{{ description }}</p>
      <div class="tags" v-if="tags.length">
        <span v-for="tag in tags" :key="tag">{{ tag }}</span>
      </div>
    </div>
    <div class="card-thumbnail" v-if="thumbnail">
      <img :src="thumbnail" :alt="title" loading="lazy" />
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  gap: 24px;
  cursor: pointer;

  padding: 24px 0;
  border-bottom: 1px solid var(--border);
  transition: border-color 0.3s ease-in-out;
}

.card:hover {
  opacity: 0.7;
}

.card-content {
  flex: 1;
  min-width: 0; /* ? */
}

.status {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-faint);
  border: 1px solid var(--border);
  padding: 2px 8px;
  border-radius: 2px;
}

.card-content h2 {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.card-content p {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 12px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  /* opacity: 0.6; */
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px; /* ? */
}

.tags span {
  font-size: 0.65rem;
  font-weight: 500; /* ? */
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-faint);
}

.card-thumbnail {
  flex-shrink: 0; /* */
  width: 200px;
  height: 140px;
  overflow: hidden;
  border-radius: 2px;
}

.card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 480px) {
  .card {
    flex-direction: column-reverse; /* */
    gap: 16px; /* */
    padding: 20px 0;
  }

  h2 {
    font-size: 1rem;
  }

  /* */
  .card-thumbnail {
    width: 100%;
    height: 180px;
  }
}
</style>
