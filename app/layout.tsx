import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TPSTREAM - Watch Movies & Series',
  description: 'Global streaming platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#08090c] text-white antialiased">{children}</body>
    </html>
  );
}
