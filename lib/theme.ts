export type ThemeId = 'dark' | 'light' | 'system';

export const THEME_KEY = 'pflegeassistent-theme';

export const DARK  = { bg: '#0a0a0f', bgCard: '#16162a', text: '#f0ede8', textSub: '#a09a90', accent: '#d4860a' } as const;
export const LIGHT = { bg: '#f5f1eb', bgCard: '#eae5dd', text: '#18182a', textSub: '#6b6258', accent: '#b87008' } as const;

export function resolveTheme(id: ThemeId): 'dark' | 'light' {
  if (id === 'system') {
    return typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return id;
}

export function applyTheme(id: ThemeId): void {
  document.documentElement.setAttribute('data-theme', resolveTheme(id));
}

export function getStoredTheme(): ThemeId {
  try {
    const s = localStorage.getItem(THEME_KEY);
    if (s === 'dark' || s === 'light' || s === 'system') return s;
  } catch {}
  return 'system';
}
