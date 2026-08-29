import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Code Quest Academy',
  description: 'A fun learning game for computer science concepts',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
