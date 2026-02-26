export const platforms = {
  soundcloud: {
    label: 'SoundCloud',
    icon: '►',
    color: '#e07840', // приглушённый оранжевый (оригинал #ff5500)
  },
  spotify: {
    label: 'Spotify',
    icon: '►',
    color: '#1db954',
  },
  bandcamp: {
    label: 'Bandcamp',
    icon: '►',
    color: '#629aa9', // приглушённый teal (оригинал #1da0c3)
  },
  github: {
    label: 'GitHub',
    icon: '↗',
    color: '#8b949e',
  },
  youtube: {
    label: 'YouTube',
    icon: '►',
    color: '#cd4e3e', // приглушённый красный (оригинал #ff0000)
  },
}

export const defaultPlatform = {
  label: 'External Link',
  icon: '↗',
  color: 'var(--text-muted)', // фолбэк на тему
}

const domainMap = {
  'soundcloud.com': 'soundcloud',
  'spotify.com': 'spotify',
  'open.spotify.com': 'spotify',
  'bandcamp.com': 'bandcamp',
  'github.com': 'github',
  'youtube.com': 'youtube',
  'youtu.be': 'youtube',
}

export function detectPlatform(url, explicitPlatform) {
  if (explicitPlatform && platforms[explicitPlatform]) {
    return platforms[explicitPlatform]
  }

  try {
    const hostname = new URL(url).hostname.replace('www.', '')
    for (const [domain, key] of Object.entries(domainMap)) {
      if (hostname === domain || hostname.endsWith(`.${domain}`)) {
        // endsWith для поддержки поддоменов, например, open.spotify.com
        return platforms[key]
      }
    }
  } catch {}

  return defaultPlatform
}
