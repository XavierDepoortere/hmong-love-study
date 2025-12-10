"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import Header from "@/components/Header";

type FormState = {
  sexe: string;
  age: string;
  ville: string;
  q1_usage: string;
  q2_interet: string;
  q3_pourquoi: string;
  q4_culture: string;
  q5_culture_features: string[];
  q5_autre: string;
  q6_features: string[];
  q7_fuir: string;
  q8_rester: string;
  q9_style: string;
  q10_accroche: string;
};

const initialForm: FormState = {
  sexe: "",
  age: "",
  ville: "",
  q1_usage: "",
  q2_interet: "",
  q3_pourquoi: "",
  q4_culture: "",
  q5_culture_features: [],
  q5_autre: "",
  q6_features: [],
  q7_fuir: "",
  q8_rester: "",
  q9_style: "",
  q10_accroche: "",
};

export default function QuestionnairePage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkEligibility = async () => {
      // 1. Vérifier localStorage d'abord (rapide)
      const localDone = localStorage.getItem("hmonglove_survey_done") === "1";

      // 2. Vérifier l'IP côté serveur
      try {
        const res = await fetch("/api/check-ip");
        const data = await res.json();

        if (data.alreadyAnswered && localDone) {
          setAlreadyAnswered(true);
        }
      } catch (error) {
        console.error("Erreur vérification IP:", error);
        // En cas d'erreur, on laisse accéder au formulaire
        // La vérification se fera à la soumission
      }

      setIsChecking(false);
    };

    checkEligibility();
  }, []);

  const handleRadioChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (
    field: "q5_culture_features" | "q6_features",
    value: string
  ) => {
    setForm((prev) => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  const handleInputChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!form.sexe) newErrors.push("sexe");
    if (!form.age || parseInt(form.age) < 13 || parseInt(form.age) > 120)
      newErrors.push("age");
    if (!form.q1_usage) newErrors.push("q1_usage");
    if (!form.q2_interet) newErrors.push("q2_interet");
    if (!form.q4_culture) newErrors.push("q4_culture");
    if (!form.q9_style) newErrors.push("q9_style");
    if (!form.q10_accroche) newErrors.push("q10_accroche");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    if (alreadyAnswered) {
      alert(t.errors.already_answered);
      return;
    }

    setIsSubmitting(true);

    const q5Features = [...form.q5_culture_features];
    if (form.q5_autre.trim()) {
      q5Features.push(`autre:${form.q5_autre.trim()}`);
    }

    const payload = {
      sexe: form.sexe,
      age: parseInt(form.age),
      ville: form.ville || null,
      q1_usage: form.q1_usage,
      q2_interet: form.q2_interet,
      q3_pourquoi: form.q3_pourquoi || null,
      q4_culture: form.q4_culture,
      q5_culture_features: q5Features,
      q6_features: form.q6_features,
      q7_fuir: form.q7_fuir || null,
      q8_rester: form.q8_rester || null,
      q9_style: form.q9_style,
      q10_accroche: form.q10_accroche,
      langue: locale,
      hadLocal: localStorage.getItem("hmonglove_survey_done") === "1",
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "already_answered") {
        localStorage.setItem("hmonglove_survey_done", "1");
        setAlreadyAnswered(true);
        alert(t.errors.already_answered);
        return;
      }

      if (data.status === "success") {
        localStorage.setItem("hmonglove_survey_done", "1");
        router.push("/thank-you");
      } else {
        alert(t.errors.submission_failed);
      }
    } catch {
      alert(t.errors.submission_failed);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Écran de chargement pendant la vérification
  if (!mounted || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center hmong-pattern">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-white/70">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  // Écran si déjà répondu
  if (alreadyAnswered) {
    return (
      <div className="min-h-screen hmong-pattern">
        <Header view={true} />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass-card">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-hmong-gold/20 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-hmong-gold"
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
              </div>
              <h1 className="text-2xl font-display font-bold text-hmong-gold mb-4">
                {t.errors.already_answered}
              </h1>
              <p className="text-white/70 mb-6">{t.thank_you.message}</p>
              <a
                href="/"
                className="inline-flex items-center gap-2 text-hmong-gold hover:text-white transition-colors"
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
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const RadioOption = ({
    field,
    value,
    label,
  }: {
    field: keyof FormState;
    value: string;
    label: string;
  }) => (
    <div
      onClick={() => handleRadioChange(field, value)}
      className={`custom-radio ${form[field] === value ? "selected" : ""}`}
    >
      <div className="indicator" />
      <span className="text-white/90">{label}</span>
    </div>
  );

  const CheckboxOption = ({
    field,
    value,
    label,
  }: {
    field: "q5_culture_features" | "q6_features";
    value: string;
    label: string;
  }) => (
    <div
      onClick={() => handleCheckboxChange(field, value)}
      className={`custom-checkbox ${
        form[field].includes(value) ? "selected" : ""
      }`}
    >
      <div className="indicator">
        {form[field].includes(value) && (
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span className="text-white/90">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen hmong-pattern">
      <Header view={true} />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Intro */}
          <div className="glass-card mb-8 animate-fade-in">
            <p className="text-white/90 text-lg mb-2">
              {t.questionnaire.intro}
            </p>
            <p className="text-hmong-gold text-sm flex items-center gap-2">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t.questionnaire.estimatedTime}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section: Informations personnelles */}
            <section className="glass-card animate-slide-up">
              <h3 className="section-header">
                {t.questionnaire.sections.personal}
              </h3>

              {/* Sexe */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">
                  {t.questionnaire.fields.sexe.label}{" "}
                  <span className="text-hmong-red">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["HOMME", "FEMME", "AUTRE"] as const).map((option) => (
                    <RadioOption
                      key={option}
                      field="sexe"
                      value={option}
                      label={t.questionnaire.fields.sexe.options[option]}
                    />
                  ))}
                </div>
                {errors.includes("sexe") && (
                  <p className="text-hmong-red text-sm mt-2">
                    {t.common.required}
                  </p>
                )}
              </div>

              {/* Âge */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">
                  {t.questionnaire.fields.age.label}{" "}
                  <span className="text-hmong-red">*</span>
                </label>
                <input
                  type="number"
                  min="13"
                  max="120"
                  value={form.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder={t.questionnaire.fields.age.placeholder}
                  className="form-input max-w-32"
                />
                {errors.includes("age") && (
                  <p className="text-hmong-red text-sm mt-2">
                    {t.errors.age_invalid}
                  </p>
                )}
              </div>

              {/* Ville */}
              <div>
                <label className="block text-white font-medium mb-3">
                  {t.questionnaire.fields.ville.label}{" "}
                  <span className="text-white/50 text-sm">
                    ({t.common.optional})
                  </span>
                </label>
                <input
                  type="text"
                  value={form.ville}
                  onChange={(e) => handleInputChange("ville", e.target.value)}
                  placeholder={t.questionnaire.fields.ville.placeholder}
                  className="form-input"
                />
              </div>
            </section>

            {/* Section: Questions principales */}
            <section
              className="glass-card animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="section-header">
                {t.questionnaire.sections.main}
              </h3>

              {/* Q1 */}
              <div className="mb-8">
                <label className="block text-white font-medium mb-3">
                  {t.questionnaire.questions.q1.label}{" "}
                  <span className="text-hmong-red">*</span>
                </label>
                <div className="space-y-2">
                  {(
                    ["REGULIEREMENT", "PARFOIS", "RAREMENT", "JAMAIS"] as const
                  ).map((option) => (
                    <RadioOption
                      key={option}
                      field="q1_usage"
                      value={option}
                      label={t.questionnaire.questions.q1.options[option]}
                    />
                  ))}
                </div>
                {errors.includes("q1_usage") && (
                  <p className="text-hmong-red text-sm mt-2">
                    {t.common.required}
                  </p>
                )}
              </div>

              {/* Q2 */}
              <div className="mb-8">
                <label className="block text-white font-medium mb-3">
                  {t.questionnaire.questions.q2.label}{" "}
                  <span className="text-hmong-red">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["OUI", "NON", "PEUT_ETRE"] as const).map((option) => (
                    <RadioOption
                      key={option}
                      field="q2_interet"
                      value={option}
                      label={t.questionnaire.questions.q2.options[option]}
                    />
                  ))}
                </div>
                {errors.includes("q2_interet") && (
                  <p className="text-hmong-red text-sm mt-2">
                    {t.common.required}
                  </p>
                )}
              </div>

              {/* Q3 */}
              <div className="mb-8">
                <label className="block text-white font-medium mb-3">
                  {t.questionnaire.questions.q3.label}
                </label>
                <textarea
                  value={form.q3_pourquoi}
                  onChange={(e) =>
                    handleInputChange("q3_pourquoi", e.target.value)
                  }
                  placeholder={t.questionnaire.questions.q3.placeholder}
                  maxLength={1000}
                  className="form-input"
                  rows={3}
                />
              </div>

              {/* Q4 */}
              <div className="mb-8">
                <label className="block text-white font-medium mb-3">
                  {t.questionnaire.questions.q4.label}{" "}
                  <span className="text-hmong-red">*</span>
                </label>
                <div className="space-y-2">
                  {(
                    [
                      "TRES_IMPORTANTE",
                      "ASSEZ_IMPORTANTE",
                      "PEU",
                      "PAS_DU_TOUT",
                    ] as const
                  ).map((option) => (
                    <RadioOption
                      key={option}
                      field="q4_culture"
                      value={option}
                      label={t.questionnaire.questions.q4.options[option]}
                    />
                  ))}
                </div>
                {errors.includes("q4_culture") && (
                  <p className="text-hmong-red text-sm mt-2">
                    {t.common.required}
                  </p>
                )}
              </div>

              {/* Q5 */}
              <div className="mb-8">
                <label className="block text-white font-medium mb-1">
                  {t.questionnaire.questions.q5.label}
                </label>
                <p className="text-white/50 text-sm mb-3">
                  {t.questionnaire.questions.q5.hint}
                </p>
                <div className="space-y-2 mb-3">
                  {(["clan", "langue", "activites", "traditions"] as const).map(
                    (option) => (
                      <CheckboxOption
                        key={option}
                        field="q5_culture_features"
                        value={option}
                        label={t.questionnaire.questions.q5.options[option]}
                      />
                    )
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/70">
                    {t.questionnaire.questions.q5.options.autre}:
                  </span>
                  <input
                    type="text"
                    value={form.q5_autre}
                    onChange={(e) =>
                      handleInputChange("q5_autre", e.target.value)
                    }
                    placeholder={t.questionnaire.questions.q5.autrePlaceholder}
                    className="form-input flex-1"
                  />
                </div>
              </div>

              {/* Q6 */}
              <div className="mb-8">
                <label className="block text-white font-medium mb-1">
                  {t.questionnaire.questions.q6.label}
                </label>
                <p className="text-white/50 text-sm mb-3">
                  {t.questionnaire.questions.q6.hint}
                </p>
                <div className="space-y-2">
                  {(
                    [
                      "chat",
                      "appel",
                      "verification",
                      "match",
                      "photos",
                    ] as const
                  ).map((option) => (
                    <CheckboxOption
                      key={option}
                      field="q6_features"
                      value={option}
                      label={t.questionnaire.questions.q6.options[option]}
                    />
                  ))}
                </div>
              </div>

              {/* Q7 */}
              <div className="mb-8">
                <label className="block text-white font-medium mb-3">
                  {t.questionnaire.questions.q7.label}
                </label>
                <textarea
                  value={form.q7_fuir}
                  onChange={(e) => handleInputChange("q7_fuir", e.target.value)}
                  placeholder={t.questionnaire.questions.q7.placeholder}
                  maxLength={1000}
                  className="form-input"
                  rows={3}
                />
              </div>

              {/* Q8 */}
              <div className="mb-8">
                <label className="block text-white font-medium mb-3">
                  {t.questionnaire.questions.q8.label}
                </label>
                <textarea
                  value={form.q8_rester}
                  onChange={(e) =>
                    handleInputChange("q8_rester", e.target.value)
                  }
                  placeholder={t.questionnaire.questions.q8.placeholder}
                  maxLength={1000}
                  className="form-input"
                  rows={3}
                />
              </div>

              {/* Q9 */}
              <div className="mb-8">
                <label className="block text-white font-medium mb-3">
                  {t.questionnaire.questions.q9.label}{" "}
                  <span className="text-hmong-red">*</span>
                </label>
                <div className="space-y-2">
                  {(
                    ["MODERNE_FUN", "TRADITIONNEL_ELEGANT", "LES_DEUX"] as const
                  ).map((option) => (
                    <RadioOption
                      key={option}
                      field="q9_style"
                      value={option}
                      label={t.questionnaire.questions.q9.options[option]}
                    />
                  ))}
                </div>
                {errors.includes("q9_style") && (
                  <p className="text-hmong-red text-sm mt-2">
                    {t.common.required}
                  </p>
                )}
              </div>

              {/* Q10 */}
              <div>
                <label className="block text-white font-medium mb-3">
                  {t.questionnaire.questions.q10.label}{" "}
                  <span className="text-hmong-red">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    ["SERIEUSE", "FUN", "CULTURELLE", "ROMANTIQUE"] as const
                  ).map((option) => (
                    <RadioOption
                      key={option}
                      field="q10_accroche"
                      value={option}
                      label={t.questionnaire.questions.q10.options[option]}
                    />
                  ))}
                </div>
                {errors.includes("q10_accroche") && (
                  <p className="text-hmong-red text-sm mt-2">
                    {t.common.required}
                  </p>
                )}
              </div>
            </section>

            {/* RGPD */}
            <div className="text-center text-white/50 text-sm px-4">
              {t.legal.rgpd}
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-lg inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" />
                    {t.questionnaire.submitting}
                  </>
                ) : (
                  <>
                    {t.questionnaire.submit}
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
