import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarketDetail } from '../../hooks/useMarketDetail';

function setMetaTag(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setNameTag(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

const OPTION_COLORS = [
  '#22C55E', '#EF4444', '#3B82F6', '#F59E0B',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
];

export function MarketDetailPage() {
  const { marketId } = useParams<{ marketId: string }>();
  const navigate = useNavigate();
  const { data: market, isLoading, error } = useMarketDetail(marketId);

  useEffect(() => {
    if (!market) return;
    document.title = market.title;
    setMetaTag('og:title', market.title);
    setMetaTag('og:description', market.description || market.title);
    setMetaTag('og:type', 'website');
    if (market.imageUrl) setMetaTag('og:image', market.imageUrl);
    setNameTag('twitter:card', 'summary_large_image');
    setNameTag('twitter:title', market.title);
    setNameTag('twitter:description', market.description || market.title);
    if (market.imageUrl) setNameTag('twitter:image', market.imageUrl);
    return () => {
      document.title = (window as any).__brand?.siteName || 'Markets';
    };
  }, [market]);

  if (isLoading)
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[#1e1e1e] rounded w-3/4" />
          <div className="h-[300px] bg-[#1e1e1e] rounded-2xl" />
          <div className="h-4 bg-[#1e1e1e] rounded w-full" />
        </div>
      </div>
    );

  if (error || !market)
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-[#666]">
        <p>Market not found.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-sm underline">
          Back to markets
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#666] hover:text-white transition-colors mb-6 text-sm"
      >
        ← Back
      </button>

      {market.imageUrl && (
        <div className="relative w-full h-[280px] rounded-2xl overflow-hidden mb-6">
          <img src={market.imageUrl} alt={market.title} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
          />
        </div>
      )}

      <h1 className="text-2xl font-bold text-white mb-3">{market.title}</h1>
      {market.description && <p className="text-[#888] text-sm leading-relaxed mb-6">{market.description}</p>}

      <div className="rounded-xl border border-[#262626] bg-[#141414] p-5 mb-6">
        <h2 className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-4">Outcomes</h2>
        <div className="space-y-3">
          {market.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: OPTION_COLORS[i % OPTION_COLORS.length] }}
              />
              <span className="flex-1 text-sm text-white">{opt.optionName}</span>
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: OPTION_COLORS[i % OPTION_COLORS.length] }}
              >
                {(opt.probability * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>

        <div className="flex h-2 rounded-full overflow-hidden gap-px mt-4">
          {market.options.map((opt, i) => (
            <div
              key={i}
              className="h-full transition-all duration-500"
              style={{
                width: `${(opt.probability * 100).toFixed(1)}%`,
                backgroundColor: OPTION_COLORS[i % OPTION_COLORS.length],
              }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {market.totalLiquidity > 0 && (
          <div className="rounded-xl border border-[#262626] bg-[#141414] p-4">
            <p className="text-xs text-[#666] mb-1">Total Liquidity</p>
            <p className="text-lg font-bold text-white">${(market.totalLiquidity / 1_000_000).toFixed(2)}</p>
          </div>
        )}
        {market.totalVolume > 0 && (
          <div className="rounded-xl border border-[#262626] bg-[#141414] p-4">
            <p className="text-xs text-[#666] mb-1">Total Volume</p>
            <p className="text-lg font-bold text-white">${(market.totalVolume / 1_000_000).toFixed(2)}</p>
          </div>
        )}
        {market.endTime && (
          <div className="rounded-xl border border-[#262626] bg-[#141414] p-4">
            <p className="text-xs text-[#666] mb-1">Resolves</p>
            <p className="text-sm font-semibold text-white">{new Date(market.endTime * 1000).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
