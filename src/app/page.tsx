"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { t } = useTranslation();
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const done = localStorage.getItem("hmonglove_survey_done") === "1";
    setAlreadyAnswered(done);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center hmong-pattern">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen hmong-pattern">
      <Header view={true} />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            {/* Logo animé */}
            <div className="mb-8 animate-float">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-hmong-red to-red-800 shadow-2xl animate-pulse-glow">
                <span className="text-5xl">❤</span>
              </div>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-white via-hmong-gold to-white bg-clip-text text-transparent">
                Hmong Love
              </span>
            </h1>

            <p className="text-xl text-hmong-gold font-medium mb-2">
              {t.common.subtitle}
            </p>

            <h2 className="text-2xl md:text-3xl text-white/90 font-display mb-8">
              {t.home.subtitle}
            </h2>
          </div>

          {/* Card principale */}
          <div
            className="glass-card mb-8 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-hmong-gold/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-hmong-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white/90 text-lg leading-relaxed">
                  {t.home.description}
                </p>
              </div>
            </div>

            {/* CTA */}
            {alreadyAnswered ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-3 px-6 py-4 bg-hmong-gold/20 rounded-xl border border-hmong-gold/30">
                  <svg
                    className="w-6 h-6 text-hmong-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-hmong-gold font-medium">
                    {t.errors.already_answered}
                  </span>
                </div>
              </div>
            ) : (
              <Link
                href="/questionnaire"
                className="btn-primary block text-center text-lg"
              >
                {t.home.cta}
                <svg
                  className="inline-block ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            )}
          </div>

          {/* Notice */}
          <div
            className="text-center animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <p className="text-white/50 text-sm flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              {t.home.notice}
            </p>
          </div>

          {/* Décoration */}
          <div className="mt-16 flex justify-center gap-4 opacity-30">
            <div className="w-2 h-2 rounded-full bg-hmong-gold animate-pulse" />
            <div
              className="w-2 h-2 rounded-full bg-hmong-red animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-hmong-gold animate-pulse"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
