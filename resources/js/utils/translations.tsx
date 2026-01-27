export function useTranslations() {
    const translations = (window as any).__translations || {};
    return (key: string) => translations[key] || key;
}
