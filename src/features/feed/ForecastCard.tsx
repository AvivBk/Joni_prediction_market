import { formatDistanceToNow } from 'date-fns';
import type { EnrichedMarket } from '../../types/database';

const OPTION_COLORS = [
  '#22C55E', '#EF4444', '#3B82F6', '#F59E0B',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
];

function formatLiquidity(wei: number | undefined): string | null {
  if (!wei || wei <= 0) return null;
  const usd = wei / 1_000_000;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(1)}k`;
  return `$${usd.toFixed(0)}`;
}

function resolveLabel(endTimeSeconds: number | null | undefined): string | null {
  if (!endTimeSeconds) return null;
  const endDate = new Date(endTimeSeconds * 1000);
  if (endDate <= new Date()) return 'Resolved';
  return `Resolves ${formatDistanceToNow(endDate, { addSuffix: true })}`;
}

function getLeadOption(market: EnrichedMarket) {
  if (!market.prices?.length) {
    return market.options[0] ? { name: market.options[0].name, probability: 0.5 } : null;
  }
  const lead = [...market.prices].sort((a, b) => Number(b.currentPrice) - Number(a.currentPrice))[0];
  return { name: lead.optionName, probability: Number(lead.currentPrice) / 1e18 };
}

interface Props {
  market: EnrichedMarket;
  onClick: () => void;
}

export function ForecastCard({ market, onClick }: Props) {
  const lead = getLeadOption(market);
  const liq = formatLiquidity(market.totalLiquidity);
  const timeLabel = resolveLabel(market.end_time);
  const pct = lead ? `${(lead.probability * 100).toFixed(0)}%` : '—';

  return (
    <article
      onClick={onClick}
      className="relative flex flex-col rounded-xl border border-[#262626] bg-[#141414]
                 overflow-hidden cursor-pointer group
                 transition-all duration-200 hover:-translate-y-1 hover:border-[#404040]
                 hover:shadow-lg hover:shadow-black/40"
    >
      <div className="relative h-40 bg-[#1a1a1a] overflow-hidden">
        {market.image_url ? (
          <img
            src={market.image_url}
            alt={market.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-30">📊</span>
          </div>
        )}

        {lead && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              color: 'var(--primary-color, #F97316)',
            }}
          >
            {lead.name} {pct}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="text-sm font-medium text-white leading-snug line-clamp-2 flex-1">
          {market.title}
        </h3>

        {market.prices && market.prices.length > 0 && (
          <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
            {[...market.prices]
              .sort((a, b) => a.choiceIndex - b.choiceIndex)
              .map((p, i) => (
                <div
                  key={i}
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(Number(p.currentPrice) / 1e18 * 100).toFixed(1)}%`,
                    backgroundColor: OPTION_COLORS[i % OPTION_COLORS.length],
                  }}
                />
              ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-[#666]">
          <div className="flex items-center gap-2">
            {liq && (
              <span className="flex items-center gap-1">
                <span>💧</span>
                <span>{liq}</span>
              </span>
            )}
            {market.options.length > 0 && <span>{market.options.length} options</span>}
          </div>
          {timeLabel && <span className={timeLabel === 'Resolved' ? 'text-[#4ade80]' : ''}>{timeLabel}</span>}
        </div>
      </div>
    </article>
  );
}
