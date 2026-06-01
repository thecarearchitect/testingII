import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PflegeAssistent KI – Du bist nicht allein',
  description: 'Dein persönlicher KI-Assistent für pflegende Angehörige. Formulare, Widersprüche, Alltagshilfe.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-inter">{children}</body>
    </html>
  );
}
