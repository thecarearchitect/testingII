import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PflegeAssistent KI – Hilfe für pflegende Angehörige',
  description:
    'KI-Unterstützung für pflegende Angehörige: Formulare ausfüllen, Widersprüche schreiben, Alltagsfragen beantwortet.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
