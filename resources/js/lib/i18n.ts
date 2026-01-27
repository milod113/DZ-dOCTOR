import { usePage } from "@inertiajs/react";

type I18nPayload = {
  locale: "fr" | "ar" | "en";
  dir: "rtl" | "ltr";
  translations: Record<string, string>;
  displayTimezone: string;
};

export function useI18n() {
  const page = usePage<{ i18n?: I18nPayload }>();

  const i18n: I18nPayload = page.props.i18n ?? {
    locale: "fr",
    dir: "ltr",
    translations: {},
    displayTimezone: "Africa/Algiers",
  };

  const t = (key: string) => i18n.translations?.[key] ?? key;

  return {
    locale: i18n.locale,
    dir: i18n.dir,
    tz: i18n.displayTimezone,
    t,
  };
}

export function formatDateTime(isoOrDateString: string, locale: string, timeZone: string) {
  const d = new Date(isoOrDateString);
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
