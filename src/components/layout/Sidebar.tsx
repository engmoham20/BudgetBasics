import { NavLink } from 'react-router-dom';
import { Sun, Moon, Monitor, Languages } from 'lucide-react';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import { useTheme } from '@/hooks/useTheme';
import { NAV_ITEMS } from './navConfig';
import { APP_CONFIG } from '@/config';
import clsx from 'clsx';

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const { t, language, setLanguage } = useI18n();
  const { theme, cycleTheme } = useTheme();

  const groups: Array<{ key: 'learning' | 'tools' | 'support'; label: TranslationKey }> = [
    { key: 'learning', label: 'nav.learning' },
    { key: 'tools', label: 'nav.tools' },
    { key: 'support', label: 'nav.support' },
  ];

  const themeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const ThemeIcon = themeIcon;

  return (
    <div className="flex flex-col h-full bg-surface border-e border-border-custom">
      <div className="flex items-center justify-between p-4 border-b border-border-custom">
        <span className="text-lg font-bold text-fg">{APP_CONFIG.appName}</span>
        <div className="flex items-center gap-1">
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
      </div>

      <nav className="flex-1 overflow-y-auto p-3" aria-label="Main navigation">
        {groups.map((group) => (
          <div key={group.key} className="mb-4">
            <p className="px-3 py-1 text-xs font-semibold text-muted uppercase tracking-wide">
              {t(group.label)}
            </p>
            <div className="flex flex-col gap-0.5 mt-1">
              {NAV_ITEMS.filter((item) => item.group === group.key).map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted hover:text-fg hover:bg-bg'
                      )
                    }
                  >
                    <Icon size={18} className="shrink-0" />
                    <span>{t(item.labelKey)}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
