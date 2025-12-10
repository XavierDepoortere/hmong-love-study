"use client";

import { useState, useEffect } from "react";
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
  Legend,
} from "recharts";

const COLORS = [
  "#B30000",
  "#D4A017",
  "#0A1A2F",
  "#4A90D9",
  "#2ECC71",
  "#9B59B6",
];

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
  rawData: Array<Record<string, unknown>>;
};

export default function StatsPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);

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

  if (!stats) {
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

  return (
    <div className="min-h-screen hmong-pattern">
      <Header view={false} />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold text-hmong-gold">
              Statistiques — Hmong Love
            </h1>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card text-center">
              <p className="text-4xl font-bold text-hmong-gold">
                {stats.totalResponses}
              </p>
              <p className="text-white/70">Réponses totales</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-4xl font-bold text-hmong-gold">
                {stats.averageAge}
              </p>
              <p className="text-white/70">Âge moyen</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-4xl font-bold text-hmong-gold">
                {stats.q2Stats.OUI > 0
                  ? Math.round((stats.q2Stats.OUI / stats.totalResponses) * 100)
                  : 0}
                %
              </p>
              <p className="text-white/70">Intéressés</p>
            </div>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Sexe */}
            <div className="glass-card">
              <h3 className="section-header">Répartition par sexe</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={toChartData(stats.sexeStats, sexeLabels)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {toChartData(stats.sexeStats).map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Q2 - Intérêt */}
            <div className="glass-card">
              <h3 className="section-header">Intérêt pour Hmong Love</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={toChartData(stats.q2Stats, q2Labels)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {toChartData(stats.q2Stats).map((_, idx) => (
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
                <BarChart data={toChartData(stats.q1Stats, q1Labels)}>
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
                <BarChart data={toChartData(stats.q4Stats, q4Labels)}>
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
                  data={toChartData(stats.q5Counts, q5Labels)}
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
                  data={toChartData(stats.q6Counts, q6Labels)}
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
            <h3 className="section-header">Réponses ouvertes</h3>

            <div className="space-y-6">
              {/* Q3 */}
              <div>
                <h4 className="text-hmong-gold font-medium mb-3">
                  Pourquoi ? (Q3)
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {stats.openResponses.q3.length > 0 ? (
                    stats.openResponses.q3.map((r) => (
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
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {stats.openResponses.q7.length > 0 ? (
                    stats.openResponses.q7.map((r) => (
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
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {stats.openResponses.q8.length > 0 ? (
                    stats.openResponses.q8.map((r) => (
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
