"use client";

import { useI18n } from "@/lib/i18n";

export default function LanguageSelector() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 backdrop-blur-sm">
      <button
        onClick={() => setLocale("fr")}
        content="FR"
        className={`h-15 w-15 px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-500 ${
          locale === "fr"
            ? "bg-hmong-gold text-hmong-navy"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLocale("hm")}
        className={`h-15 w-15 px-2.5 py-2.5 rounded-full text-sm font-medium transition-all duration-500 ${
          locale === "hm"
            ? "bg-hmong-gold text-hmong-navy"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        HM
      </button>
    </div>
  );
}
