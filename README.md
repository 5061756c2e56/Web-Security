<div align="center">

# Web Security Dashboard

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react)

Dashboard de sécurité professionnel développé avec Next.js, TypeScript, Tailwind CSS, avec support multilingue (FR/EN) et outils cryptographiques.

[🐛 Issues](https://github.com/5061756c2e56/Web-Security/issues)
</div>

---

## 📋 Table des matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠️ Technologies](#️-technologies)
- [🚀 Démarrage rapide](#-démarrage-rapide)
- [⚙️ Configuration](#️-configuration)
- [🔒 Sécurité](#-sécurité)
- [🐳 Déploiement avec Docker](#-déploiement-avec-docker)
- [📝 Scripts disponibles](#-scripts-disponibles)

## ✨ Fonctionnalités

- 🔐 **Shamir Secret Sharing** : Partage sécurisé de secrets avec schéma de seuil
- 🔒 **Chiffrement de fichiers** : AES-256-GCM avec support ZIP
- 🔍 **Vérification HASH** : SHA-256, SHA-512, SHA-384, SHA-1, MD5
- 🔑 **Générateur de mots de passe** : Mots de passe sécurisés avec options personnalisables
- 🎫 **Décodeur JWT** : Décodage et vérification de tokens JWT
- 🔄 **Encodeur/Décodeur** : Base64, Base64URL, Hex, URL encoding/decoding
- 📱 **Générateur QR Codes** : Génération de QR codes personnalisables
- 🔐 **Dérivation de clés** : PBKDF2 avec paramètres configurables
- 🎲 **Nombres aléatoires** : Générateur cryptographique sécurisé
- 📜 **Visualiseur certificats** : Analyse de certificats SSL/TLS
- 🛡️ **Tokens CSRF** : Génération et vérification de tokens CSRF
- 🆔 **Générateur UUID** : UUID v4 sécurisés
- 📊 **Analyseur d'entropie** : Analyse de force des mots de passe
- 📚 **Guides de sécurité** : Documentation complète sur la sécurité web
- 🌍 **Internationalisation** : Français et Anglais
- 📱 **Responsive** : Design adaptatif mobile-first
- 🎨 **UI Moderne** : Animations fluides, thème sombre/clair
- 🔍 **SEO** : Metadata optimisée, sitemap, robots.txt, structured data
- 📲 **PWA** : Manifest configuré pour installation

## 🛠️ Technologies

![Tech Stack](https://skillicons.dev/icons?i=nextjs,typescript,react,tailwind)

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Language** : [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components** : [Radix UI](https://www.radix-ui.com/)
- **Internationalisation** : [next-intl](https://next-intl-docs.vercel.app/)
- **Cryptographie** : [@noble/hashes](https://github.com/paulmillr/noble-hashes), [jose](https://github.com/panva/jose), [argon2](https://github.com/ranisalt/node-argon2)
- **Shamir Secret Sharing** : [secrets.js-grempe](https://github.com/grempe/secrets.js)
- **QR Codes** : [qrcode](https://github.com/soldair/node-qrcode)
- **Content** : [MDX](https://mdxjs.com/) avec [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- **Package Manager** : [pnpm](https://pnpm.io/)

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ 
- pnpm installé

### Installation

```bash
# Cloner le repository
git clone https://github.com/5061756c2e56/Web-Security.git
cd Web-Security

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev
```

Ouvrez [http://localhost:3001](http://localhost:3001) dans votre navigateur.

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Authentification (optionnel - pour protéger l'accès)
PROTECTION=true
PROTECTION_PASSWORD_HASH=your_argon2_hash
SESSION_SECRET=your_session_secret_min_32_chars

NEXT_PUBLIC_SITE_URL=url_de_votre_site

# Optionnel : Google Search Console Verification
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_verification_code

# Optionnel : Mode Noël (enable/disable)
NEXT_PUBLIC_CHRISTMAS_MODE=true
```

### Génération des secrets

Le projet inclut des scripts pour générer les secrets nécessaires :

```bash
# Générer un hash de mot de passe Argon2
node scripts/generate-password-hash.js

# Générer une clé de session
node scripts/generate-session-secret.js
```

**Note** : Si `PROTECTION_PASSWORD_HASH` n'est pas configuré, l'application sera accessible sans authentification. Pour protéger l'accès, configurez un mot de passe avec le script de génération.

## 🔒 Sécurité

Le projet implémente plusieurs mesures de sécurité :

- ✅ **Headers de sécurité** : HSTS, X-Frame-Options, CSP stricte, etc.
- ✅ **Content Security Policy** : CSP stricte avec whitelist des domaines autorisés
- ✅ **Authentification sécurisée** : Argon2 pour le hashage des mots de passe
- ✅ **Sessions sécurisées** : Tokens JWT signés avec rotation
- ✅ **Cryptographie** : Utilisation de bibliothèques cryptographiques modernes
- ✅ **Validation des données** : Validation côté client et serveur
- ✅ **Protection CSRF** : Génération et vérification de tokens CSRF
- ✅ **Traitement côté client** : Les opérations sensibles sont effectuées dans le navigateur

## 🐳 Déploiement avec Docker

### Prérequis

- Docker et Docker Compose installés

### Déploiement avec Docker Compose

1. **Cloner le repository**

```bash
git clone https://github.com/5061756c2e56/Web-Security.git
cd Web-Security
```

2. **Créer le fichier `.env`**

Créez un fichier `.env` à la racine avec vos variables d'environnement :

```env
# Authentification (optionnel - pour protéger l'accès)
PROTECTION=true
PROTECTION_PASSWORD_HASH=your_argon2_hash
SESSION_SECRET=your_session_secret_min_32_chars

NEXT_PUBLIC_SITE_URL=url_de_votre_site

# Optionnel : Google Search Console Verification
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_verification_code

# Optionnel : Mode Noël (enable/disable)
NEXT_PUBLIC_CHRISTMAS_MODE=true

NODE_ENV=production
```

3. **Construire et lancer les containers**

```bash
docker-compose up -d --build
```

4. **Vérifier le déploiement**

L'application sera accessible sur `http://localhost:3001`

### Déploiement avec Docker uniquement

1. **Construire l'image**

```bash
docker build -t web-security:latest .
```

2. **Lancer le container**

```bash
docker run -d \
  --name web-security \
  -p 3001:3001 \
  -e PROTECTION=true \
  -e PROTECTION_PASSWORD_HASH=your_argon2_hash \
  -e SESSION_SECRET=your_session_secret_min_32_chars \
  -e NEXT_PUBLIC_SITE_URL=url_de_votre_site \
  -e NEXT_PUBLIC_CHRISTMAS_MODE=true \
  -e NODE_ENV=production \
  web-security:latest
```

### Optimisations Docker

Le Dockerfile utilise un build multi-stage pour optimiser la taille de l'image finale :

- **Stage 1** : Installation des dépendances avec pnpm
- **Stage 2** : Build de l'application Next.js
- **Stage 3** : Image finale minimale avec uniquement les fichiers nécessaires

L'image finale est optimisée pour la production avec :
- Node.js 20 LTS (Debian slim)
- User non-root pour la sécurité
- Cache des layers pour accélérer les builds

## 📝 Scripts disponibles

```bash
# Développement
pnpm dev          # Lance le serveur de développement sur le port 3001

# Build
pnpm build        # Construit l'application pour la production

# Production
pnpm start        # Lance le serveur de production sur le port 3001

# Linting
pnpm lint         # Vérifie le code avec ESLint
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👤 Auteur

**Paul Viandier**

- Email: [contact@paulviandier.com](mailto:contact@paulviandier.com)
- GitHub: [@5061756c2e56/](https://github.com/5061756c2e56/)
- LinkedIn: [Paul Viandier](https://www.linkedin.com/in/paul-viandier-648837397/)

---

<div align="center">

Fait avec ❤️ par Viandier Paul

[⬆ Retour en haut](#web-security-dashboard)

</div>
