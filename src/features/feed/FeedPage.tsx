import { useNavigate } from 'react-router-dom';
import { useMarkets } from '../../hooks/useMarkets';
import { ForecastCard } from './ForecastCard';
import { FeedSkeleton } from './FeedSkeleton';
import type { EnrichedMarket } from '../../types/database';

function SiteHero() {
  const brand = (window as any).__brand || {};
  const siteName = brand.siteName || document.title || 'Prediction Markets';
  const tagline = brand.tagline || 'Trade on what you know';

  return (
    <div className="mb-8 pt-6 pb-4">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-block w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: 'var(--primary-color, #F97316)' }}
        />
        <span className="text-xs text-[#666] uppercase tracking-wider font-medium">Live Markets</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-1">{siteName}</h1>
      <p className="text-[#888] text-sm">{tagline}</p>
    </div>
  );
}

function HeroMarket({ market, onClick }: { market: EnrichedMarket; onClick: () => void }) {
  const leadOption = market.prices?.length
    ? [...market.prices].sort((a, b) => Number(b.currentPrice) - Number(a.currentPrice))[0]
    : null;

  const pct = leadOption ? `${(Number(leadOption.currentPrice) / 1e18 * 100).toFixed(0)}%` : null;

  return (
    <div onClick={onClick} className="relative w-full h-[360px] rounded-2xl overflow-hidden cursor-pointer mb-8 group">
      {market.image_url ? (
        <img
          src={market.image_url}
          alt={market.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#111]" />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3">
        {leadOption && pct && (
          <div
            className="self-start px-3 py-1.5 rounded-full text-sm font-bold"
            style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'var(--primary-color, #F97316)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {leadOption.optionName} · {pct}
          </div>
        )}
        <h2 className="text-xl md:text-2xl font-bold text-white leading-tight max-w-2xl">{market.title}</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: 'var(--primary-color, #F97316)' }}>
            Trade now →
          </span>
          {market.options.length > 0 && <span className="text-xs text-[#888]">{market.options.length} outcomes</span>}
        </div>
      </div>
    </div>
  );
}

export function FeedPage() {
  const navigate = useNavigate();
  const { data: markets, isLoading, error } = useMarkets();

  const handleCardClick = (market: EnrichedMarket) => {
    navigate(`/market/${market.rain_market_id}`);
  };

  if (isLoading)
    return (
      <div className="max-w-6xl mx-auto px-4">
        <SiteHero />
        <FeedSkeleton count={6} />
      </div>
    );

  if (error)
    return (
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <p className="text-[#666] text-center">Failed to load markets.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm px-4 py-2 rounded-lg border border-[#333] text-[#999] hover:border-[#555] transition-colors"
        >
          Retry
        </button>
      </div>
    );

  if (!markets || markets.length === 0)
    return (
      <div className="max-w-6xl mx-auto px-4">
        <SiteHero />
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-[#666] gap-2">
          <span className="text-4xl">📭</span>
          <p className="text-sm">No markets yet. Ask Joni to create some!</p>
        </div>
      </div>
    );

  const [hero, ...rest] = markets;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      <SiteHero />
      <HeroMarket market={hero} onClick={() => handleCardClick(hero)} />
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((market) => (
            <ForecastCard key={market.id} market={market} onClick={() => handleCardClick(market)} />
          ))}
        </div>
      )}
    </div>
  );
}
