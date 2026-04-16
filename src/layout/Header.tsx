import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { BrandConfig } from '../brand';
import { AccessibilityWidget } from '../components/AccessibilityWidget';
import { TranslateWidget } from '../components/TranslateWidget';

interface HeaderProps {
  brand: BrandConfig;
}

export default function Header({ brand }: HeaderProps) {
  return (
    <header className="h-20 border-b border-[#262626] bg-[#0a0a0a] sticky top-0 z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">

        {/* Logo + Site Name + Tagline */}
        <div className="flex items-center gap-4">
          <img
            src={brand.logoPath}
            className="h-14 w-auto max-w-[240px] object-contain"
            alt={brand.siteName}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          {/* Fallback: colored dot + name (shown only if logo fails) */}
          <span
            className="items-center gap-2 text-xl font-bold text-white"
            style={{ display: 'none' }}
          >
            <span
              className="w-5 h-5 rounded-full inline-block"
              style={{ backgroundColor: 'var(--primary-color)' }}
            />
            {brand.siteName}
          </span>
          {/* Site name + tagline — always visible */}
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white leading-tight">
              {brand.siteName}
            </span>
            {brand.tagline && (
              <span className="text-xs text-[#9ca3af] leading-tight">
                {brand.tagline}
              </span>
            )}
          </div>
        </div>

        {/* Right side: Accessibility + Translate + Connect */}
        <div className="flex items-center gap-2">
          <AccessibilityWidget />
          <TranslateWidget />
          <ConnectButton />
        </div>

      </div>
    </header>
  );
}
