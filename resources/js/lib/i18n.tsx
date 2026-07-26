import { ar } from '@/locales/ar';
import { fr } from '@/locales/fr';
import { DirectionProvider } from '@radix-ui/react-direction';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

export type Locale = 'fr' | 'en' | 'ar';

export const LOCALES: { value: Locale; label: string; dir: 'ltr' | 'rtl' }[] = [
    { value: 'fr', label: 'Français', dir: 'ltr' },
    { value: 'en', label: 'English', dir: 'ltr' },
    { value: 'ar', label: 'العربية', dir: 'rtl' },
];

/**
 * Dictionary keys are the English strings; French is the product's primary
 * language, English falls back to the key itself.
 */
const dictionaries: Record<Locale, Record<string, string>> = {
    fr,
    en: {},
    ar,
};

interface I18n {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18n | null>(null);

function readStoredLocale(): Locale {
    if (typeof window === 'undefined') return 'fr';
    const stored = window.localStorage.getItem('locale');
    return stored === 'en' || stored === 'ar' ? stored : 'fr';
}

function applyLocale(locale: Locale): void {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    // Plain cookie so Laravel serves flash/validation messages in the same
    // language (see the SetLocale middleware).
    document.cookie = `locale=${locale};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

    useEffect(() => {
        applyLocale(locale);
    }, [locale]);

    const setLocale = useCallback((next: Locale) => {
        setLocaleState(next);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('locale', next);
        }
        applyLocale(next);
    }, []);

    const t = useCallback(
        (key: string, params?: Record<string, string | number>) => {
            let text = dictionaries[locale][key] ?? key;
            if (params) {
                for (const [name, value] of Object.entries(params)) {
                    text = text.replaceAll(`:${name}`, String(value));
                }
            }
            return text;
        },
        [locale],
    );

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {/* Radix primitives (dropdowns, dialogs, selects) need the
                direction context to position correctly in RTL. */}
            <DirectionProvider dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                {children}
            </DirectionProvider>
        </I18nContext.Provider>
    );
}

export function useI18n(): I18n {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used inside <I18nProvider>');
    }
    return context;
}

/** Shorthand when only the translator is needed. */
export function useT() {
    return useI18n().t;
}
