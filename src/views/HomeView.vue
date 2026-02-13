<script setup>
import me from '@/assets/images/me.webp'
</script>

<template>
  <main class="home">
    <div class="intro">
      <h1>Dima Timofeev</h1>
      <p>Music producer, sound designer and frontend developer</p>

      <nav class="sections">
        <RouterLink to="/sound">Sound -></RouterLink>
        <RouterLink to="/frontend">Frontend -></RouterLink>
      </nav>
    </div>

    <img :src="me" alt="Dima Timofeev — portrait" class="photo" />
  </main>
</template>

<style scoped>
.home {
  padding: 48px 32px;
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 3fr;
  align-items: center;
  gap: 48px;
  overflow: hidden;
}

.photo {
  width: 100%;
  max-height: 80vh;
  object-fit: cover;
  object-position: 50% 25%;
}

h1 {
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin-bottom: 8px;
}

p {
  color: var(--text-muted);
  font-size: 1rem;
  /* opacity: 0.6; */
  margin-bottom: 48px;
}

.sections {
  display: flex;
  gap: 24px;
}

.sections a {
  color: var(--text);
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  transition: opacity 0.2s ease-in-out;
}

.sections a:hover {
  opacity: 0.4;
}

@media (max-width: 480px) {
  .home {
    grid-template-columns: 1fr;
    padding: 32px 16px;
    min-height: auto; /* ? */
    gap: 32px;
  }

  .photo {
    width: 100%;
    height: 240px;
    order: -1; /* ? */
  }

  h1 {
    font-size: 1.75rem;
  }

  .sections {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
