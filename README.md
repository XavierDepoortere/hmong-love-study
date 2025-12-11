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

````

## 🚀 Installation

### 1. Cloner et installer

```bash
git clone https://github.com/XavierDepoortere/hmong-love-study.git
cd hmong-love
npm install
````

### 2. Configuration

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

| Route            | Description                                   |
| ---------------- | --------------------------------------------- |
| `/`              | Page d'accueil avec CTA vers le questionnaire |
| `/questionnaire` | Formulaire d'enquête complet                  |
| `/thank-you`     | Page de remerciement après soumission         |
| `/stats`         | Dashboard admin (protégé par mot de passe)    |

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

## 📝 Licence

Projet privé — Tous droits réservés.
