import en, { Lang } from 'lang/locale/en';
import ru from 'lang/locale/ru';

const localeMap: { [k: string]: Partial<Lang> } = {
    en,
    ru,
};

const lang = window.localStorage.getItem('language');
const locale = localeMap[lang || 'en'];

export function i18n(str: keyof typeof en): string {
    if (!locale) {
        console.error('Error: locale not found', lang);
    }

    return (locale && locale[str]) || en[str];
}
