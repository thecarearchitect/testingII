'use client';

import { useState, useEffect } from 'react';
import { Sun, Monitor, Moon } from 'lucide-react';
import { type ThemeId, THEME_KEY, applyTheme, getStoredTheme } from '@/lib/theme';

const OPTIONS: { id: ThemeId; label: string; Icon: React.ElementType }[] = [
  { id: 'light',  label: 'Hell',   Icon: Sun },
  { id: 'system', label: 'System', Icon: Monitor },
  { id: 'dark',   label: 'Dunkel', Icon: Moon },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeId>('system');

  useEffect(() => { setTheme(getStoredTheme()); }, []);

  const select = (id: ThemeId) => {
    setTheme(id);
    try { localStorage.setItem(THEME_KEY, id); } catch {}
    applyTheme(id);
  };

  return (
    <div style={{
      display: 'flex', gap: 2,
      background: 'rgba(128,128,128,0.12)',
      border: '1px solid rgba(128,128,128,0.20)',
      borderRadius: 10, padding: 3,
    }}>
      {OPTIONS.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => select(id)}
          title={label}
          style={{
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 7, border: 'none', cursor: 'pointer',
            background: theme === id ? 'var(--accent)' : 'transparent',
            color: theme === id ? '#fff' : 'var(--text-sub)',
            transition: 'background .15s, color .15s',
          }}
        >
          <Icon size={13} />
        </button>
      ))}
    </div>
  );
}
