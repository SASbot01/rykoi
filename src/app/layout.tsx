import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'RYŌIKI | 領域展開',
  description: 'Enter the domain. Crowdfund legendary openings. Own your destiny. The next evolution of Pokemon TCG collecting.',
  keywords: ['Pokemon', 'TCG', 'NFT', 'Crowdfunding', 'Trading Cards', 'Collectibles', 'Ryoiki'],
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
        {children}
      </body>
    </html>
  );
}
