'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export function PWAProvider() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registered:', reg.scope);

            // Check for updates every 60 seconds
            setInterval(() => reg.update(), 60_000);
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err);
          });
      });
    }

    // Capture the install prompt (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Only show banner if user hasn't dismissed it before
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        // Wait 30 seconds before showing the install prompt
        setTimeout(() => setShowInstallBanner(true), 30_000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Hide banner if already installed
    window.addEventListener('appinstalled', () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      console.log('[PWA] App installed successfully');
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] Install outcome:', outcome);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', '1');
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50 print:hidden">
      <div className="bg-[#1E3A8A] rounded-2xl p-4 shadow-2xl border-2 border-blue-700 flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shrink-0">
          <span className="text-blue-900 font-black text-lg">B</span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-sm uppercase tracking-tight">
            Add to Home Screen
          </p>
          <p className="text-blue-300 text-xs font-medium mt-0.5 leading-relaxed">
            Install BibleFunLand for quick access — works offline too!
          </p>
          <button
            onClick={handleInstall}
            className="mt-3 flex items-center gap-1.5 bg-yellow-400 text-blue-900 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Install App
          </button>
        </div>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="p-1 text-blue-400 hover:text-white transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
