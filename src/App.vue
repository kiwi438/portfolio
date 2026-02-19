<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useTheme } from './composables/useTheme'

const { isLight, toggle } = useTheme()
</script>

<template>
  <div class="app">
    <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/sound">Sound</RouterLink>
        <RouterLink to="/frontend">Frontend</RouterLink>
        <button class="theme-toggle" @click="toggle">
          {{ isLight ? '● Dark' : '○ Light' }}
        </button>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
}

header {
  padding: 32px 32px 0;
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--text-muted);
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
}

.theme-toggle:hover {
  opacity: 0.4;
}

nav {
  display: flex;
  gap: 24px;
}

nav a {
  color: var(--text);
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: opacity 0.2s ease-in-out;
}

nav a:hover {
  opacity: 0.4;
}

nav a.router-link-active {
  opacity: 1;
}

nav a:not(.router-link-active) {
  opacity: 0.4;
}

@media (max-width: 480px) {
  header {
    padding: 20px 16px 0;
  }

  nav {
    gap: 16px;
  }
}
</style>
