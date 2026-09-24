import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import { Button } from '@/components/ui/Button';
import { STORAGE_KEYS } from '@/config';
import { getItem, setItem } from '@/services/storage';

type OnboardingStep = {
  titleKey: TranslationKey;
  descKey: TranslationKey;
};

const steps: OnboardingStep[] = [
  { titleKey: 'onboarding.step1Title', descKey: 'onboarding.step1Desc' },
  { titleKey: 'onboarding.step2Title', descKey: 'onboarding.step2Desc' },
  { titleKey: 'onboarding.step3Title', descKey: 'onboarding.step3Desc' },
  { titleKey: 'onboarding.step4Title', descKey: 'onboarding.step4Desc' },
  { titleKey: 'onboarding.step5Title', descKey: 'onboarding.step5Desc' },
  { titleKey: 'onboarding.step6Title', descKey: 'onboarding.step6Desc' },
];

type OnboardingProps = {
  onComplete: () => void;
};

export function OnboardingTour({ onComplete }: OnboardingProps) {
  const { t, dir } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    prevFocus.current = document.activeElement as HTMLElement;
    const dialog = dialogRef.current;
    if (dialog) {
      const focusable = dialog.querySelector<HTMLElement>('button');
      focusable?.focus();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleSkip();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>('button');
        if (focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      prevFocus.current?.focus();
    };
  }, []);

  function handleSkip() {
    setItem(STORAGE_KEYS.onboardingComplete, true);
    onComplete();
  }

  function handleNext() {
    if (currentStep + 1 >= steps.length) {
      handleSkip();
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function handlePrev() {
    setCurrentStep((s) => Math.max(0, s - 1));
  }

  const isLast = currentStep === steps.length - 1;
  const step = steps[currentStep];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label={t('onboarding.welcome')}
    >
      <div
        ref={dialogRef}
        className="bg-surface border border-border-custom rounded-xl shadow-lg w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep ? 'w-6 bg-primary' : 'w-2 bg-border-custom'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleSkip}
            className="p-1 text-muted hover:text-fg rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t('onboarding.skip')}
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="text-xl font-bold text-fg mb-2">{t(step.titleKey)}</h2>
        <p className="text-sm text-muted mb-6">{t(step.descKey)}</p>

        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2 py-1"
          >
            {t('onboarding.skip')}
          </button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="secondary" size="sm" onClick={handlePrev}>
                {dir === 'rtl' ? <ChevronRight size={16} className="rtl:rotate-180" /> : <ChevronLeft size={16} />}
                {t('onboarding.previous')}
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={handleNext}>
              {isLast ? t('onboarding.finish') : t('onboarding.next')}
              {dir === 'rtl' ? <ChevronLeft size={16} className="rtl:rotate-180" /> : <ChevronRight size={16} />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const completed = getItem<boolean>(STORAGE_KEYS.onboardingComplete, false);
    if (!completed) {
      setShowOnboarding(true);
    }
  }, []);

  function completeOnboarding() {
    setShowOnboarding(false);
  }

  function restartOnboarding() {
    setItem(STORAGE_KEYS.onboardingComplete, false);
    setShowOnboarding(true);
  }

  return { showOnboarding, completeOnboarding, restartOnboarding };
}
