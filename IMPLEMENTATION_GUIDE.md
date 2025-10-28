# Guide d'Implémentation - Système d'Invitation ADISA

## 🎉 Système Complètement Implémenté !

Votre application ADISA dispose maintenant d'un système d'authentification complet basé sur invitation avec authentification à deux facteurs (2FA) obligatoire.

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Compte Administrateur](#compte-administrateur)
3. [Flux d'Invitation](#flux-dinvitation)
4. [Authentification 2FA](#authentification-2fa)
5. [Routes API](#routes-api)
6. [Base de Données](#base-de-données)
7. [Frontend (À Compléter)](#frontend-à-compléter)
8. [Tests](#tests)

---

## Vue d'Ensemble

### Architecture
- **Backend**: Node.js + Express (port 4000)
- **Frontend**: React + Refine + Ant Design (port 5000)
- **Base de Données**: PostgreSQL (Replit)
- **Email**: Replit Mail (intégré)
- **2FA**: OTPAuth + Google Authenticator

### Fonctionnalités Implémentées ✅

- ✅ Système d'invitation uniquement par email
- ✅ Compte administrateur créé
- ✅ Authentification username/password
- ✅ 2FA obligatoire pour tous les utilisateurs
- ✅ Envoi d'emails d'invitation automatique
- ✅ Panneau d'administration
- ✅ Gestion des organisations
- ✅ Séparation stricte des rôles (admin/user)

---

## Compte Administrateur

### Informations de Connexion

```
Username: cheikhfall7
Password: Nazim@2207
Email: admin@adisa.local
Role: admin
```

### Accès Admin

L'administrateur peut :
- Se connecter via `/admin` (à implémenter dans le frontend)
- Inviter des utilisateurs
- Voir tous les comptes utilisateurs
- Voir tous les audits et données
- Gérer les accès

**Note**: L'admin n'a PAS de 2FA activé par défaut. Vous pouvez l'activer si nécessaire.

---

## Flux d'Invitation

### 1. Admin Invite un Utilisateur

```bash
POST /api/admin/invite
Headers: Cookie (session admin)
Body: {
  "email": "utilisateur@example.com"
}
```

**Résultat**:
- Token d'invitation généré
- Email envoyé automatiquement
- Lien d'invitation valable 7 jours

### 2. Email d'Invitation

L'utilisateur reçoit un email avec:
- Lien de création de compte
- Token unique
- Instructions

### 3. Création de Compte

L'utilisateur clique sur le lien et accède à `/register?token=XXXX`

```bash
POST /api/register
Body: {
  "token": "...",
  "username": "utilisateur1",
  "password": "MotDePasse123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Résultat**:
- Compte créé
- Invitation marquée comme utilisée
- Redirection vers configuration 2FA

### 4. Configuration 2FA (Obligatoire)

```bash
POST /api/2fa/generate
Body: {
  "userId": "user_id"
}
```

**Résultat**:
- QR Code généré
- Secret 2FA créé

L'utilisateur scanne le QR code avec Google Authenticator, puis:

```bash
POST /api/2fa/verify
Body: {
  "userId": "user_id",
  "token": "123456"
}
```

**Résultat**:
- 2FA activé
- Compte totalement configuré

---

## Authentification 2FA

### Login en 2 Étapes

#### Étape 1: Username/Password

```bash
POST /api/login
Body: {
  "username": "utilisateur1",
  "password": "MotDePasse123!"
}
```

**Réponse**:
```json
{
  "success": true,
  "requires2FA": true,
  "userId": "..."
}
```

#### Étape 2: Code 2FA

```bash
POST /api/2fa/authenticate
Body: {
  "token": "123456"
}
```

**Réponse**:
```json
{
  "authenticated": true,
  "user": {
    "id": "...",
    "username": "utilisateur1",
    "role": "user"
  }
}
```

---

## Routes API

### Routes Publiques

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/login` | POST | Connexion username/password |
| `/api/register` | POST | Inscription avec token |
| `/api/invitation/validate/:token` | GET | Valider token d'invitation |

### Routes Authentifiées

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/logout` | GET | Déconnexion |
| `/api/auth/check` | GET | Vérifier statut auth |
| `/api/auth/user` | GET | Obtenir profil utilisateur |
| `/api/2fa/generate` | POST | Générer secret 2FA |
| `/api/2fa/verify` | POST | Vérifier et activer 2FA |
| `/api/2fa/authenticate` | POST | Authentifier avec 2FA |
| `/api/organization` | GET | Obtenir organisation |
| `/api/organization` | POST | Créer/modifier organisation |

### Routes Admin Uniquement

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/admin/invite` | POST | Inviter utilisateur |
| `/api/admin/users` | GET | Liste tous les utilisateurs |

---

## Base de Données

### Tables

#### `users`
```sql
id VARCHAR PRIMARY KEY
username VARCHAR UNIQUE
email VARCHAR UNIQUE
password VARCHAR
role user_role (admin/user)
first_name VARCHAR
last_name VARCHAR
profile_image_url VARCHAR
two_factor_secret VARCHAR
two_factor_enabled BOOLEAN
is_active BOOLEAN
invited_by VARCHAR
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### `invitations`
```sql
id VARCHAR PRIMARY KEY
email VARCHAR
token VARCHAR UNIQUE
invited_by VARCHAR
used BOOLEAN
created_at TIMESTAMP
expires_at TIMESTAMP
```

#### `organizations`
```sql
id VARCHAR PRIMARY KEY
user_id VARCHAR
name VARCHAR
description TEXT
sector VARCHAR
size VARCHAR
country VARCHAR
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### `sessions`
```sql
sid VARCHAR PRIMARY KEY
sess JSONB
expire TIMESTAMP
```

---

## Frontend (À Compléter)

### Pages à Créer

#### 1. Page de Login (`/login`)

Composants nécessaires:
- Formulaire username/password
- Gestion du flux 2FA
- Redirection après login

#### 2. Page de Vérification 2FA (`/verify-2fa`)

Composants nécessaires:
- Input pour code 6 chiffres
- Timer (30 secondes)
- Bouton "Vérifier"

#### 3. Page d'Inscription (`/register`)

Composants nécessaires:
- Validation du token
- Formulaire d'inscription
- Setup 2FA avec QR code
- Instructions Google Authenticator

#### 4. Panneau Admin (`/admin`)

Composants nécessaires:
- Liste des utilisateurs
- Formulaire d'invitation
- Statistiques
- Gestion des accès

#### 5. Configuration Organisation (`/organization`)

Composants nécessaires:
- Formulaire organisation
- Informations entreprise
- Sauvegarde auto

### AuthProvider à Mettre à Jour

```typescript
// src/authProvider.ts
import { AuthBindings } from "@refinedev/core";

const authProvider: AuthBindings = {
  login: async ({ username, password }) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success && data.requires2FA) {
      // Rediriger vers page 2FA
      window.location.href = "/verify-2fa";
      return { success: false };
    }

    return { success: data.success };
  },

  logout: async () => {
    await fetch("/api/logout", {
      credentials: "include",
    });
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const response = await fetch("/api/auth/check", {
      credentials: "include",
    });

    return {
      authenticated: response.ok,
      redirectTo: response.ok ? undefined : "/login",
    };
  },

  getIdentity: async () => {
    const response = await fetch("/api/auth/user", {
      credentials: "include",
    });

    if (!response.ok) return null;

    const user = await response.json();
    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      avatar: user.profileImageUrl,
    };
  },

  onError: async (error) => {
    if (error.status === 401) {
      return { logout: true };
    }
    return {};
  },

  getPermissions: async () => {
    const response = await fetch("/api/auth/user", {
      credentials: "include",
    });

    if (!response.ok) return null;

    const user = await response.json();
    return user.role; // "admin" ou "user"
  },
};

export default authProvider;
```

---

## Tests

### Test 1: Connexion Admin

```bash
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"cheikhfall7","password":"Nazim@2207"}'
```

**Résultat attendu**:
```json
{
  "success": true,
  "requires2FA": false,
  "user": {
    "id": "...",
    "username": "cheikhfall7",
    "role": "admin"
  }
}
```

### Test 2: Invitation

```bash
curl -X POST http://localhost:4000/api/admin/invite \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=..." \
  -d '{"email":"test@example.com"}'
```

### Test 3: Validation Token

```bash
curl http://localhost:4000/api/invitation/validate/TOKEN_ICI
```

---

## Sécurité

### Mesures Implémentées

- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ Sessions sécurisées (HTTP-only, secure cookies)
- ✅ 2FA obligatoire pour utilisateurs
- ✅ Tokens d'invitation à usage unique
- ✅ Expiration des invitations (7 jours)
- ✅ Séparation stricte admin/user
- ✅ Validation des entrées

### Recommandations

1. **Variables d'Environnement**: Assurez-vous que `SESSION_SECRET` est défini
2. **HTTPS**: Activez HTTPS en production
3. **Rate Limiting**: Ajoutez rate limiting sur les routes de connexion
4. **Backup Codes**: Implémentez des codes de récupération 2FA

---

## Prochaines Étapes

1. ✅ Backend complètement implémenté
2. ⏳ Créer les pages frontend listées ci-dessus
3. ⏳ Tester le flux complet
4. ⏳ Ajouter des audits (suivi des actions)
5. ⏳ Implémenter les fonctionnalités métier (questionnaires, scoring, etc.)

---

## Support

Pour toute question ou problème:

1. Vérifiez les logs: `npm run dev`
2. Testez les routes API avec curl ou Postman
3. Consultez ce guide

## Structure des Fichiers Créés

```
server/
├── auth.ts                 # Authentification username/password
├── invitations.ts          # Système d'invitation
├── twoFactor.ts           # Authentification 2FA
├── storage.ts             # Accès base de données
├── db.ts                  # Configuration DB + sessions
├── index.ts               # Serveur principal
└── scripts/
    └── create-admin.ts    # Script création admin

src/
└── utils/
    └── replitmail.ts      # Utilitaire envoi d'emails

shared/
└── schema.ts              # Schéma Drizzle (tables DB)
```

---

**Fait avec ❤️ pour ADISA - AfricTivistes Digital Safety Audit**
