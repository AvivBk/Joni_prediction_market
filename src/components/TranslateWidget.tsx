import { useState, useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export function TranslateWidget() {
  const [open, setOpen]   = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (document.getElementById('google-translate-script')) {
      setReady(true);
      return;
    }
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'auto', layout: 0 },
        'google-translate-el'
      );
      setReady(true);
    };
    const script = document.createElement('script');
    script.id  = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        title="Translate page"
        aria-label="Translate page"
        className="flex items-center justify-center w-9 h-9 rounded-lg text-[#888] hover:text-white hover:bg-white/10 transition-colors text-base"
      >
        🌐
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 bg-[#1a1a1a] border border-[#333] rounded-xl p-4 z-50 shadow-2xl shadow-black/60 min-w-[220px]">
            <p className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-3">
              Translate Page
            </p>
            {ready ? (
              <div id="google-translate-el" />
            ) : (
              <p className="text-xs text-[#888]">Loading translator...</p>
            )}
            <p className="text-[10px] text-[#555] mt-3 leading-relaxed">
              Powered by Google Translate.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
