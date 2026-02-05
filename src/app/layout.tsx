import type { Metadata } from 'next';
import '@/styles/globals.css';
import { LangProvider } from '@/lib/lang-context';

export const metadata: Metadata = {
  title: 'RYŌIKI | 領域展開',
  description: 'Enter the domain. Crowdfund legendary openings. Own your destiny. The next evolution of Pokemon TCG collecting.',
  keywords: ['Pokemon', 'TCG', 'NFT', 'Crowdfunding', 'Trading Cards', 'Collectibles', 'Ryoiki'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'RYŌIKI',
    description: 'Enter the domain. Own your destiny.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
