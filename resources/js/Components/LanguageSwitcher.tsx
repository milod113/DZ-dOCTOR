import { router, usePage } from "@inertiajs/react";
import { useI18n } from "@/lib/i18n";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
  color: string;
}

export default function LanguageSwitcher() {
  const { t, locale } = useI18n();
  const { url } = usePage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = [
    {
      code: "fr",
      name: "Français",
      flag: "🇫🇷",
      nativeName: "Français",
      color: "bg-gradient-to-r from-blue-500 to-white"
    },
    {
      code: "en",
      name: "English",
      flag: "🇺🇸",
      nativeName: "English",
      color: "bg-gradient-to-r from-red-500 to-blue-500"
    },
    {
      code: "ar",
      name: "العربية",
      flag: "🇸🇦",
      nativeName: "العربية",
      color: "bg-gradient-to-r from-green-500 to-white"
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const setLang = (next: string) => {
    setIsOpen(false);
    router.get(route("lang.set", { locale: next }), {}, { preserveScroll: true });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-blue-50/0 to-transparent group-hover:via-blue-50/50 transition-all duration-500"></div>

        <div className="relative flex items-center gap-3">
          {/* Globe Icon */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center group-hover:from-blue-100 group-hover:to-cyan-100 transition-all duration-300">
            <Globe className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
          </div>

          {/* Current Language Display */}
          <div className="hidden sm:flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentLanguage.flag}</span>
              <span className="text-sm font-bold text-gray-800">{currentLanguage.code.toUpperCase()}</span>
            </div>
            <span className="text-xs text-gray-500">{currentLanguage.name}</span>
          </div>

          <ChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'group-hover:text-blue-400'}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 py-3 z-50 animate-in fade-in slide-in-from-top-5 duration-200 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-2 border-b border-gray-100/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Select Language</div>
                <div className="text-xs text-gray-500">Choose your preferred language</div>
              </div>
            </div>
          </div>

          {/* Language Options */}
          <div className="py-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => setLang(language.code)}
                className={`group relative flex items-center gap-3 w-full px-4 py-3.5 transition-all duration-200 overflow-hidden ${
                  locale === language.code
                    ? 'bg-gradient-to-r from-blue-50/80 to-cyan-50/80 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50/50'
                }`}
              >
                {/* Flag with gradient background */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl shadow-sm transition-transform duration-300 ${
                  locale === language.code ? 'scale-110 shadow-md' : 'group-hover:scale-105'
                }`}>
                  {language.flag}
                </div>

                {/* Language Info */}
                <div className="flex-1 text-left">
                  <div className="font-semibold">{language.name}</div>
                  <div className="text-sm text-gray-500">{language.nativeName}</div>
                </div>

                {/* Active Indicator */}
                {locale === language.code && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <Check className="w-4 h-4 text-blue-500" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-white/50">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Changes apply immediately</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl"></div>
        </div>
      )}

      {/* Mobile Select (Fallback) */}
      <div className="sm:hidden mt-3">
        <div className="relative">
          <select
            value={locale}
            onChange={(e) => setLang(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-white shadow-sm appearance-none text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.flag} {language.name} ({language.code.toUpperCase()})
              </option>
            ))}
          </select>
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Globe className="w-4 h-4 text-gray-500" />
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Animation Styles */}

    </div>
  );
}
