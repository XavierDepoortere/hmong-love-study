# Hmong Love — Étude de marché

Application web pour collecter des réponses à une enquête destinée à la communauté Hmong, dans le cadre du développement d'une future application de rencontre.

## 🎨 Design

- **Rouge Hmong traditionnel** : `#B30000`
- **Doré textile Hmong** : `#D4A017`
- **Bleu nuit** : `#0A1A2F`
- **Blanc textile** : `#F5F5F5`

## 🛠 Stack technique

- **Frontend** : Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend** : API Routes Next.js
- **ORM** : Prisma
- **Base de données** : PostgreSQL
- **Graphiques** : Recharts
- **i18n** : Français / Hmong

## 📁 Structure

```
hmong-love/
├── prisma/
│   └── schema.prisma       # Schéma de la base de données
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── submit/     # API pour soumettre les réponses
│   │   │   └── stats/      # API pour récupérer les statistiques
│   │   ├── questionnaire/  # Page du questionnaire
│   │   ├── stats/          # Page admin des statistiques
│   │   ├── thank-you/      # Page de remerciement
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Page d'accueil
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx
│   │   └── LanguageSelector.tsx
│   ├── i18n/
│   │   ├── fr.json         # Traductions françaises
│   │   └── hm.json         # Traductions Hmong
│   └── lib/
│       ├── i18n.tsx        # Context i18n
│       ├── prisma.ts       # Client Prisma
│       └── utils.ts        # Utilitaires
├── .env.example
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🚀 Installation

### 1. Cloner et installer

```bash
git clone <repo-url>
cd hmong-love
npm install
```

### 2. Configuration

Copier le fichier d'environnement et le configurer :

```bash
cp .env.example .env
```

Éditer `.env` avec vos paramètres :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/hmonglove?schema=public"
ADMIN_PASSWORD="votre_mot_de_passe_secret"
```

### 3. Base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables dans la base de données
npm run db:push

# (Optionnel) Ouvrir Prisma Studio pour voir les données
npm run db:studio
```

### 4. Lancer le développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 📊 Pages

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil avec CTA vers le questionnaire |
| `/questionnaire` | Formulaire d'enquête complet |
| `/thank-you` | Page de remerciement après soumission |
| `/stats` | Dashboard admin (protégé par mot de passe) |

## 🔒 Sécurité anti-doublon

1. **localStorage** : Un flag `hmonglove_survey_done` empêche la soumission multiple côté client
2. **Hash IP** : L'IP du visiteur est hashée (SHA-256) et stockée pour détecter les doublons côté serveur
3. **Double vérification** : Si `hadLocal === true` ET l'IP existe déjà, la soumission est rejetée

## 🌐 Internationalisation

L'application supporte deux langues :
- **FR** : Français (par défaut)
- **HM** : Hmong

Le sélecteur de langue est persisté en `localStorage`.

## 📈 Export des données

La page `/stats` permet d'exporter toutes les réponses en CSV (anonymisé, sans IP).

## 🚢 Déploiement

### Avec Coolify

1. Connecter votre repo GitHub à Coolify
2. Configurer les variables d'environnement
3. Déployer !

### Variables d'environnement requises

- `DATABASE_URL` : URL de connexion PostgreSQL
- `ADMIN_PASSWORD` : Mot de passe pour accéder à `/stats`

## 📝 Licence

Projet privé — Tous droits réservés.
