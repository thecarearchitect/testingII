'use client';

export default function SparkleIcon({ active = false, size = 14 }: { active?: boolean; size?: number }) {
  return (
    <span
      className={active ? 'sparkle-active' : 'sparkle-idle'}
      aria-hidden="true"
      style={{ fontSize: size, lineHeight: 1, display: 'inline-block' }}
    >
      ✦
    </span>
  );
}
