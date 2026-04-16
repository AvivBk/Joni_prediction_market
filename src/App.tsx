import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './layout/Header';
import { FeedPage } from './features/feed/FeedPage';
import { MarketDetailPage } from './features/market-detail/MarketDetailPage';
import type { BrandConfig } from './brand';

export default function App() {
  const [brand, setBrand] = useState<BrandConfig | null>(null);

  useEffect(() => {
    fetch('/brand.json')
      .then(r => r.json())
      .then(b => {
        setBrand(b);
        // Keep CSS vars in sync with live brand.json
        document.documentElement.style.setProperty('--primary-color', b.primaryColor);
        document.documentElement.style.setProperty('--accent-color', b.accentColor || b.primaryColor);
      })
      .catch(() => {
        setBrand({
          siteName: 'Markets',
          tagline: 'Where conviction meets the future',
          primaryColor: '#F97316',
          accentColor: '#F97316',
          logoPath: '/logo.png',
          marketIds: [],
        });
      });
  }, []);

  if (!brand) {
    return <div className="bg-[#0a0a0a] text-white flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Header brand={brand} />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/market/:marketId" element={<MarketDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}
