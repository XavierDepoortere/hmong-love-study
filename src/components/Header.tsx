"use client";

import Link from "next/link";
import LanguageSelector from "./LanguageSelector";

export default function Header({ view }: { view: boolean }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-display font-bold text-white group-hover:text-hmong-gold transition-colors">
            Hmong Love
          </span>
          <span className="text-xl text-hmong-red animate-pulse">❤</span>
        </Link>
        {view ? <LanguageSelector /> : ""}
      </div>
    </header>
  );
}
