"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#B30000",
  "#D4A017",
  "#0A1A2F",
  "#4A90D9",
  "#2ECC71",
  "#9B59B6",
];

type ResponseData = {
  id: string;
  sexe: "HOMME" | "FEMME" | "AUTRE";
  age: number;
  ville: string;
  q1_usage: string;
  q2_interet: string;
  q3_pourquoi: string | null;
  q4_culture: string;
  q5_culture_features: string[];
  q6_features: string[];
  q7_fuir: string | null;
  q8_rester: string | null;
  q9_style: string;
  q10_accroche: string;
  langue: string;
  createdAt: string;
};

type StatsData = {
  totalResponses: number;
  averageAge: number;
  sexeStats: Record<string, number>;
  q1Stats: Record<string, number>;
  q2Stats: Record<string, number>;
  q4Stats: Record<string, number>;
  q5Counts: Record<string, number>;
  q6Counts: Record<string, number>;
  q9Stats: Record<string, number>;
  q10Stats: Record<string, number>;
  openResponses: {
    q3: Array<{ id: string; text: string; date: string }>;
    q7: Array<{ id: string; text: string; date: string }>;
    q8: Array<{ id: string; text: string; date: string }>;
  };
  rawData: ResponseData[];
};

type SexeFilter = "TOUS" | "HOMME" | "FEMME" | "AUTRE";

export default function StatsPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [sexeFilter, setSexeFilter] = useState<SexeFilter>("TOUS");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stats", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (res.status === 401) {
        setError("Mot de passe incorrect");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setStats(data);
      setIsAuthenticated(true);
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les données en fonction du sexe sélectionné
  const filteredData = useMemo(() => {
    if (!stats) return null;

    const responses =
      sexeFilter === "TOUS"
        ? stats.rawData
        : stats.rawData.filter((r) => r.sexe === sexeFilter);

    const totalResponses = responses.length;

    const averageAge =
      responses.length > 0
        ? Math.round(
            responses.reduce((sum, r) => sum + r.age, 0) / responses.length
          )
        : 0;

    const sexeStats = {
      HOMME: responses.filter((r) => r.sexe === "HOMME").length,
      FEMME: responses.filter((r) => r.sexe === "FEMME").length,
      AUTRE: responses.filter((r) => r.sexe === "AUTRE").length,
    };

    const q1Stats = {
      REGULIEREMENT: responses.filter((r) => r.q1_usage === "REGULIEREMENT")
        .length,
      PARFOIS: responses.filter((r) => r.q1_usage === "PARFOIS").length,
      RAREMENT: responses.filter((r) => r.q1_usage === "RAREMENT").length,
      JAMAIS: responses.filter((r) => r.q1_usage === "JAMAIS").length,
    };

    const q2Stats = {
      OUI: responses.filter((r) => r.q2_interet === "OUI").length,
      NON: responses.filter((r) => r.q2_interet === "NON").length,
      PEUT_ETRE: responses.filter((r) => r.q2_interet === "PEUT_ETRE").length,
    };

    const q4Stats = {
      TRES_IMPORTANTE: responses.filter(
        (r) => r.q4_culture === "TRES_IMPORTANTE"
      ).length,
      ASSEZ_IMPORTANTE: responses.filter(
        (r) => r.q4_culture === "ASSEZ_IMPORTANTE"
      ).length,
      PEU: responses.filter((r) => r.q4_culture === "PEU").length,
      PAS_DU_TOUT: responses.filter((r) => r.q4_culture === "PAS_DU_TOUT")
        .length,
    };

    const q5Counts: Record<string, number> = {};
    responses.forEach((r) => {
      r.q5_culture_features.forEach((f) => {
        q5Counts[f] = (q5Counts[f] || 0) + 1;
      });
    });

    const q6Counts: Record<string, number> = {};
    responses.forEach((r) => {
      r.q6_features.forEach((f) => {
        q6Counts[f] = (q6Counts[f] || 0) + 1;
      });
    });

    const q9Stats = {
      MODERNE_FUN: responses.filter((r) => r.q9_style === "MODERNE_FUN").length,
      TRADITIONNEL_ELEGANT: responses.filter(
        (r) => r.q9_style === "TRADITIONNEL_ELEGANT"
      ).length,
      LES_DEUX: responses.filter((r) => r.q9_style === "LES_DEUX").length,
    };

    const q10Stats = {
      SERIEUSE: responses.filter((r) => r.q10_accroche === "SERIEUSE").length,
      FUN: responses.filter((r) => r.q10_accroche === "FUN").length,
      CULTURELLE: responses.filter((r) => r.q10_accroche === "CULTURELLE")
        .length,
      ROMANTIQUE: responses.filter((r) => r.q10_accroche === "ROMANTIQUE")
        .length,
    };

    const openResponses = {
      q3: responses
        .filter((r) => r.q3_pourquoi)
        .map((r) => ({ id: r.id, text: r.q3_pourquoi!, date: r.createdAt })),
      q7: responses
        .filter((r) => r.q7_fuir)
        .map((r) => ({ id: r.id, text: r.q7_fuir!, date: r.createdAt })),
      q8: responses
        .filter((r) => r.q8_rester)
        .map((r) => ({ id: r.id, text: r.q8_rester!, date: r.createdAt })),
    };

    return {
      totalResponses,
      averageAge,
      sexeStats,
      q1Stats,
      q2Stats,
      q4Stats,
      q5Counts,
      q6Counts,
      q9Stats,
      q10Stats,
      openResponses,
    };
  }, [stats, sexeFilter]);

  const toChartData = (
    obj: Record<string, number>,
    labels?: Record<string, string>
  ) => {
    return Object.entries(obj).map(([key, value]) => ({
      name: labels?.[key] || key,
      value,
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen hmong-pattern">
        <Header view={false} />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="glass-card">
              <h1 className="text-2xl font-display font-bold text-hmong-gold mb-6 text-center">
                Accès administrateur
              </h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="Entrez le mot de passe"
                  />
                </div>
                {error && <p className="text-hmong-red text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? "Connexion..." : "Accéder"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!stats || !filteredData) {
    return (
      <div className="min-h-screen flex items-center justify-center hmong-pattern">
        <div className="spinner" />
      </div>
    );
  }

  const sexeLabels: Record<string, string> = {
    HOMME: "Homme",
    FEMME: "Femme",
    AUTRE: "Autre",
  };
  const q1Labels: Record<string, string> = {
    REGULIEREMENT: "Régulièrement",
    PARFOIS: "Parfois",
    RAREMENT: "Rarement",
    JAMAIS: "Jamais",
  };
  const q2Labels: Record<string, string> = {
    OUI: "Oui",
    NON: "Non",
    PEUT_ETRE: "Peut-être",
  };
  const q4Labels: Record<string, string> = {
    TRES_IMPORTANTE: "Très important",
    ASSEZ_IMPORTANTE: "Assez important",
    PEU: "Peu",
    PAS_DU_TOUT: "Pas du tout",
  };
  const q5Labels: Record<string, string> = {
    clan: "Clan (xeem)",
    langue: "Langue",
    activites: "Activités",
    traditions: "Traditions",
  };
  const q6Labels: Record<string, string> = {
    chat: "Chat",
    appel: "Appel",
    verification: "Vérification",
    match: "Match affinité",
    photos: "2 photos min",
  };
  const q9Labels: Record<string, string> = {
    MODERNE_FUN: "Moderne et fun",
    TRADITIONNEL_ELEGANT: "Traditionnel mais élégant",
    LES_DEUX: "Les deux",
  };
  const q10Labels: Record<string, string> = {
    SERIEUSE: "Sérieuse",
    FUN: "Fun",
    CULTURELLE: "Culturelle",
    ROMANTIQUE: "Romantique",
  };

  const filterOptions: { value: SexeFilter; label: string }[] = [
    { value: "TOUS", label: "Tous" },
    { value: "HOMME", label: "Hommes" },
    { value: "FEMME", label: "Femmes" },
    { value: "AUTRE", label: "Autre" },
  ];

  return (
    <div className="min-h-screen hmong-pattern">
      <Header view={false} />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-display font-bold text-hmong-gold">
              Statistiques — Hmong Love
            </h1>

            {/* Sélecteur de filtre par sexe */}
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm">Filtrer par :</span>
              <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSexeFilter(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      sexeFilter === option.value
                        ? "bg-hmong-gold text-hmong-navy"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {option.label}
                    {option.value !== "TOUS" && stats.rawData && (
                      <span className="ml-1 opacity-70">
                        (
                        {
                          stats.rawData.filter((r) => r.sexe === option.value)
                            .length
                        }
                        )
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Indicateur de filtre actif */}
          {sexeFilter !== "TOUS" && (
            <div className="mb-6 flex items-center gap-2">
              <span className="bg-hmong-gold/20 text-hmong-gold px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <span>
                  Filtre actif : {sexeLabels[sexeFilter] || sexeFilter}
                </span>
                <button
                  onClick={() => setSexeFilter("TOUS")}
                  className="hover:bg-hmong-gold/30 rounded-full p-0.5 transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
              <span className="text-white/50 text-sm">
                {filteredData.totalResponses} réponse
                {filteredData.totalResponses > 1 ? "s" : ""} sur{" "}
                {stats.totalResponses}
              </span>
            </div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card text-center">
              <p className="text-4xl font-bold text-hmong-gold">
                {filteredData.totalResponses}
              </p>
              <p className="text-white/70">Réponses totales</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-4xl font-bold text-hmong-gold">
                {filteredData.averageAge}
              </p>
              <p className="text-white/70">Âge moyen</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-4xl font-bold text-hmong-gold">
                {filteredData.totalResponses > 0
                  ? Math.round(
                      (filteredData.q2Stats.OUI / filteredData.totalResponses) *
                        100
                    )
                  : 0}
                %
              </p>
              <p className="text-white/70">Intéressés</p>
            </div>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Sexe - seulement si filtre = TOUS */}
            {sexeFilter === "TOUS" && (
              <div className="glass-card">
                <h3 className="section-header">Répartition par sexe</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={toChartData(filteredData.sexeStats, sexeLabels)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {toChartData(filteredData.sexeStats).map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Q2 - Intérêt */}
            <div className="glass-card">
              <h3 className="section-header">Intérêt pour Hmong Love</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={toChartData(filteredData.q2Stats, q2Labels)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {toChartData(filteredData.q2Stats).map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Q1 - Usage */}
            <div className="glass-card">
              <h3 className="section-header">Usage des apps de rencontre</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={toChartData(filteredData.q1Stats, q1Labels)}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#F5F5F5", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#F5F5F5" }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#B30000" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Q4 - Culture */}
            <div className="glass-card">
              <h3 className="section-header">
                Importance des valeurs culturelles
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={toChartData(filteredData.q4Stats, q4Labels)}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#F5F5F5", fontSize: 10 }}
                  />
                  <YAxis tick={{ fill: "#F5F5F5" }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#D4A017" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Q5 - Features culturelles */}
            <div className="glass-card">
              <h3 className="section-header">
                Fonctionnalités culturelles demandées
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={toChartData(filteredData.q5Counts, q5Labels)}
                  layout="vertical"
                >
                  <XAxis type="number" tick={{ fill: "#F5F5F5" }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#F5F5F5", fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#B30000" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Q6 - Features */}
            <div className="glass-card">
              <h3 className="section-header">Fonctionnalités indispensables</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={toChartData(filteredData.q6Counts, q6Labels)}
                  layout="vertical"
                >
                  <XAxis type="number" tick={{ fill: "#F5F5F5" }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#F5F5F5", fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#D4A017" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Q9 - Features style app */}
            <div className="glass-card">
              <h3 className="section-header">Style application</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={toChartData(filteredData.q9Stats, q9Labels)}
                  layout="vertical"
                >
                  <XAxis type="number" tick={{ fill: "#F5F5F5" }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#F5F5F5", fontSize: 12 }}
                    width={150}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#B30000" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Q10 - Features accroche */}
            <div className="glass-card">
              <h3 className="section-header">Style phrase accroche</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={toChartData(filteredData.q10Stats, q10Labels)}
                  layout="vertical"
                >
                  <XAxis type="number" tick={{ fill: "#F5F5F5" }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#F5F5F5", fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#D4A017" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Réponses ouvertes */}
          <div className="glass-card mb-8">
            <h3 className="section-header">
              Réponses ouvertes
              {sexeFilter !== "TOUS" && (
                <span className="text-sm font-normal text-white/50 ml-2">
                  ({sexeLabels[sexeFilter]})
                </span>
              )}
            </h3>

            <div className="space-y-6">
              {/* Q3 */}
              <div>
                <h4 className="text-hmong-gold font-medium mb-3">
                  Pourquoi intéressé par un site de rencontre Hmong (Q3)
                  <span className="text-white/50 text-sm ml-2">
                    ({filteredData.openResponses.q3.length} réponse
                    {filteredData.openResponses.q3.length > 1 ? "s" : ""})
                  </span>
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredData.openResponses.q3.length > 0 ? (
                    filteredData.openResponses.q3.map((r) => (
                      <div key={r.id} className="bg-white/5 p-3 rounded-lg">
                        <p className="text-white/90">{r.text}</p>
                        <p className="text-white/40 text-xs mt-1">
                          {new Date(r.date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/50">Aucune réponse</p>
                  )}
                </div>
              </div>

              {/* Q7 */}
              <div>
                <h4 className="text-hmong-gold font-medium mb-3">
                  Ce qui ferait fuir (Q7)
                  <span className="text-white/50 text-sm ml-2">
                    ({filteredData.openResponses.q7.length} réponse
                    {filteredData.openResponses.q7.length > 1 ? "s" : ""})
                  </span>
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredData.openResponses.q7.length > 0 ? (
                    filteredData.openResponses.q7.map((r) => (
                      <div key={r.id} className="bg-white/5 p-3 rounded-lg">
                        <p className="text-white/90">{r.text}</p>
                        <p className="text-white/40 text-xs mt-1">
                          {new Date(r.date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/50">Aucune réponse</p>
                  )}
                </div>
              </div>

              {/* Q8 */}
              <div>
                <h4 className="text-hmong-gold font-medium mb-3">
                  Ce qui ferait rester (Q8)
                  <span className="text-white/50 text-sm ml-2">
                    ({filteredData.openResponses.q8.length} réponse
                    {filteredData.openResponses.q8.length > 1 ? "s" : ""})
                  </span>
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredData.openResponses.q8.length > 0 ? (
                    filteredData.openResponses.q8.map((r) => (
                      <div key={r.id} className="bg-white/5 p-3 rounded-lg">
                        <p className="text-white/90">{r.text}</p>
                        <p className="text-white/40 text-xs mt-1">
                          {new Date(r.date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/50">Aucune réponse</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
