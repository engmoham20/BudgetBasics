import { useState, useEffect, type ReactNode } from 'react';
import { Menu, X, Sun, Moon, Monitor, Languages, Search } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { Sidebar } from './Sidebar';
import { APP_CONFIG } from '@/config';
import { SearchModal } from '@/features/search/SearchModal';

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { t, language, setLanguage } = useI18n();
  const { theme, cycleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const themeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const ThemeIcon = themeIcon;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-bg">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 no-print">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden no-print">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute inset-y-0 start-0 w-64">
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
          <button
            className="absolute top-4 end-4 p-2 text-white"
            onClick={() => setMobileNavOpen(false)}
            aria-label={t('nav.close')}
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile header */}
        <header className="flex items-center justify-between p-4 bg-surface border-b border-border-custom lg:hidden no-print">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-lg text-muted hover:text-fg hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={t('nav.menu')}
            >
              <Menu size={20} />
            </button>
            <span className="text-lg font-bold text-fg">{APP_CONFIG.appName}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-muted hover:text-fg hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={t('nav.search')}
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="p-2 rounded-lg text-muted hover:text-fg hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={t('language.toggle')}
            >
              <Languages size={18} />
            </button>
            <button
              onClick={cycleTheme}
              className="p-2 rounded-lg text-muted hover:text-fg hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={t('theme.toggle')}
            >
              <ThemeIcon size={18} />
            </button>
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden lg:flex items-center justify-end p-4 bg-surface border-b border-border-custom no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border-custom text-muted text-sm hover:text-fg hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={t('nav.search')}
            >
              <Search size={16} />
              <span>{t('search.placeholder')}</span>
            </button>
          </div>
        </header>

        <main id="main-content" className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
