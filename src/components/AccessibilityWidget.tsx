import { useState } from 'react';

interface A11yState {
  contrast:     boolean;
  largeText:    boolean;
  reduceMotion: boolean;
}

export function AccessibilityWidget() {
  const [open, setOpen]   = useState(false);
  const [state, setState] = useState<A11yState>({
    contrast:     false,
    largeText:    false,
    reduceMotion: false,
  });

  function toggle(key: keyof A11yState, cssClass: string) {
    const next = !state[key];
    document.documentElement.classList.toggle(cssClass, next);
    setState(prev => ({ ...prev, [key]: next }));
  }

  const btnBase = "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between";
  const btnActive = "bg-white/10 text-white";
  const btnInactive = "text-[#888] hover:bg-white/5 hover:text-white";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        title="Accessibility options"
        aria-label="Accessibility options"
        className="flex items-center justify-center w-9 h-9 rounded-lg text-[#888] hover:text-white hover:bg-white/10 transition-colors text-base"
      >
        ♿
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 w-56 bg-[#1a1a1a] border border-[#333] rounded-xl p-3 z-50 shadow-2xl shadow-black/60">
            <p className="text-xs font-semibold text-[#666] uppercase tracking-wider px-3 mb-2">
              Accessibility
            </p>

            <button
              onClick={() => toggle('contrast', 'a11y-contrast')}
              className={`${btnBase} ${state.contrast ? btnActive : btnInactive}`}
            >
              <span>High Contrast</span>
              {state.contrast && <span className="text-xs text-[#4ade80]">ON</span>}
            </button>

            <button
              onClick={() => toggle('largeText', 'a11y-large')}
              className={`${btnBase} ${state.largeText ? btnActive : btnInactive}`}
            >
              <span>Large Text</span>
              {state.largeText && <span className="text-xs text-[#4ade80]">ON</span>}
            </button>

            <button
              onClick={() => toggle('reduceMotion', 'a11y-reduce-motion')}
              className={`${btnBase} ${state.reduceMotion ? btnActive : btnInactive}`}
            >
              <span>Reduce Motion</span>
              {state.reduceMotion && <span className="text-xs text-[#4ade80]">ON</span>}
            </button>

            <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
              <button
                onClick={() => {
                  ['a11y-contrast', 'a11y-large', 'a11y-reduce-motion'].forEach(c =>
                    document.documentElement.classList.remove(c)
                  );
                  setState({ contrast: false, largeText: false, reduceMotion: false });
                }}
                className="w-full text-xs text-[#666] hover:text-white transition-colors py-1"
              >
                Reset all
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
