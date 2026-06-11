// TODO: Replace localStorage with Supabase when auth is implemented

import type { ModeId } from '@/lib/modes';

const PREFIX = 'chat_';
const MAX_RECENTS = 5;

export interface StoredMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StoredChat {
  modeId: ModeId;
  modeTitle: string;
  messages: StoredMessage[];
  lastAt: string;   // ISO string
  preview: string;  // first user message, max 60 chars
}

function storageKey(modeId: ModeId): string {
  return `${PREFIX}${modeId}`;
}

export function saveChat(modeId: ModeId, modeTitle: string, messages: StoredMessage[]): void {
  // TODO: Replace localStorage with Supabase when auth is implemented
  if (messages.length === 0) return;
  // Never shrink a stored conversation — a save from a stale closure or an
  // orphaned stream must not overwrite a longer history. Explicit deletion
  // goes through clearChat/clearAllChats only.
  const existing = loadChat(modeId);
  if (existing && existing.messages.length > messages.length) {
    console.warn('[chatStorage] Save skipped – would shrink stored chat for', modeId);
    return;
  }
  const firstUser = messages.find(m => m.role === 'user');
  const preview = firstUser
    ? firstUser.content.slice(0, 60) + (firstUser.content.length > 60 ? '…' : '')
    : '';
  const data: StoredChat = { modeId, modeTitle, messages, lastAt: new Date().toISOString(), preview };
  try {
    localStorage.setItem(storageKey(modeId), JSON.stringify(data));
  } catch (e) {
    console.warn('[chatStorage] Save failed – storage may be full:', e);
  }
}

export function loadChat(modeId: ModeId): StoredChat | null {
  // TODO: Replace localStorage with Supabase when auth is implemented
  try {
    const raw = localStorage.getItem(storageKey(modeId));
    return raw ? (JSON.parse(raw) as StoredChat) : null;
  } catch {
    return null;
  }
}

export function clearChat(modeId: ModeId): void {
  // TODO: Replace localStorage with Supabase when auth is implemented
  try { localStorage.removeItem(storageKey(modeId)); } catch {}
}

export function clearAllChats(): void {
  // TODO: Replace localStorage with Supabase when auth is implemented
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  } catch {}
}

export function getRecentChats(): StoredChat[] {
  // TODO: Replace localStorage with Supabase when auth is implemented
  try {
    const chats: StoredChat[] = [];
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => {
        try {
          const raw = localStorage.getItem(k);
          if (raw) chats.push(JSON.parse(raw) as StoredChat);
        } catch {}
      });
    return chats
      .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime())
      .slice(0, MAX_RECENTS);
  } catch {
    return [];
  }
}

export function formatRelativeDate(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days === 0) return 'Heute';
  if (days === 1) return 'Gestern';
  if (days < 7) return `vor ${days} Tagen`;
  return new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
}
