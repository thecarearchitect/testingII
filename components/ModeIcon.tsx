import { MessageSquare, FileText, PenLine, Home, Scale, type LucideIcon } from 'lucide-react';
import type { ModeId } from '@/lib/modes';

const ICONS: Record<ModeId, LucideIcon> = {
  allgemein:    MessageSquare,
  formular:     FileText,
  widerspruch:  PenLine,
  pflegealltag: Home,
  rechtlich:    Scale,
};

export default function ModeIcon({
  modeId,
  size = 18,
  color = '#d4860a',
}: {
  modeId: ModeId;
  size?: number;
  color?: string;
}) {
  const Icon = ICONS[modeId];
  return <Icon size={size} color={color} strokeWidth={1.5} />;
}
