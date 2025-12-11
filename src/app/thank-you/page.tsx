"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import Header from "@/components/Header";

export default function ThankYouPage() {
  const { t } = useTranslation();

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Hmong Love - Enquête",
          text: t.home.subtitle,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Partage annulé");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Lien copié !");
    }
  };

  return (
    <div className="min-h-screen hmong-pattern">
      <Header view={true} />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card animate-fade-in">
            {/* Icône de succès */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-2xl">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Message */}
            <h1 className="text-4xl font-display font-bold text-hmong-gold mb-4">
              {t.thank_you.title}
            </h1>
            <p className="text-xl text-white/90 mb-8">{t.thank_you.message}</p>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleShare}
                className="btn-primary inline-flex items-center gap-3"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                {t.thank_you.share}
              </button>

              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-hmong-gold transition-colors"
                >
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  {t.thank_you.backHome}
                </Link>
              </div>
            </div>
          </div>

          {/* Décoration */}
          <div className="mt-16 flex justify-center gap-6">
            <span className="text-4xl animate-float">❤</span>
            <span
              className="text-4xl animate-float"
              style={{ animationDelay: "0.2s" }}
            >
              🎉
            </span>
            <span
              className="text-4xl animate-float"
              style={{ animationDelay: "0.4s" }}
            >
              ❤
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
