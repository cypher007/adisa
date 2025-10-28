# Guide de Démarrage Rapide - ADISA

## ✅ Système Prêt à l'Emploi !

Votre système d'invitation avec 2FA obligatoire est complètement implémenté et fonctionnel.

---

## 🔐 Compte Administrateur

```
Username: cheikhfall7
Password: Nazim@2207
```

---

## 🧪 Test Rapide du Système

### 1. Tester la Connexion Admin

```bash
# Via terminal
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"cheikhfall7","password":"Nazim@2207"}'
```

**Résultat attendu** :
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

### 2. Inviter un Utilisateur

Connectez-vous d'abord comme admin, puis :

```bash
# Remplacez YOUR_SESSION_COOKIE par le cookie de session reçu
curl -X POST http://localhost:4000/api/admin/invite \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE" \
  -d '{"email":"test@example.com"}'
```

**Résultat** : Email d'invitation envoyé automatiquement avec token unique.

### 3. Valider le Token d'Invitation

```bash
# Remplacez TOKEN par le token reçu par email
curl http://localhost:4000/api/invitation/validate/TOKEN
```

### 4. Créer un Compte Utilisateur

```bash
curl -X POST http://localhost:4000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_FROM_EMAIL",
    "username": "testuser",
    "password": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Résultat** : Compte créé, redirection vers setup 2FA.

### 5. Configurer 2FA

```bash
# Générer le secret et QR code
curl -X POST http://localhost:4000/api/2fa/generate \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID_FROM_PREVIOUS_STEP"}'
```

**Résultat** : QR code et secret retournés.

Scanner le QR code avec Google Authenticator, puis :

```bash
# Vérifier avec le code 6 chiffres
curl -X POST http://localhost:4000/api/2fa/verify \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"USER_ID",
    "token":"123456"
  }'
```

### 6. Se Connecter avec 2FA

```bash
# Étape 1: Login classique
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"TestPassword123!"}'

# Étape 2: Authentification 2FA
curl -X POST http://localhost:4000/api/2fa/authenticate \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=SESSION_COOKIE" \
  -d '{"token":"123456"}'
```

---

## 📝 Routes API Disponibles

### Publiques
- `POST /api/login` - Connexion
- `POST /api/register` - Inscription (avec token)
- `GET /api/invitation/validate/:token` - Valider invitation

### Authentifié
- `GET /api/auth/check` - Vérifier auth
- `GET /api/auth/user` - Profil utilisateur
- `GET /api/logout` - Déconnexion
- `POST /api/2fa/generate` - Générer 2FA
- `POST /api/2fa/verify` - Vérifier 2FA
- `POST /api/2fa/authenticate` - Auth avec 2FA
- `GET /api/organization` - Obtenir organisation
- `POST /api/organization` - Sauvegarder organisation

### Admin Uniquement
- `POST /api/admin/invite` - Inviter utilisateur
- `GET /api/admin/users` - Liste utilisateurs

---

## 🎨 Frontend à Compléter

### Pages Nécessaires

1. **`/login`** - Page de connexion
   - Input username
   - Input password
   - Bouton login
   - Gestion flux 2FA

2. **`/verify-2fa`** - Vérification 2FA
   - Input code 6 chiffres
   - Timer 30s
   - Bouton vérifier

3. **`/register`** - Inscription
   - Validation token
   - Formulaire inscription
   - Setup 2FA avec QR code

4. **`/admin`** - Panneau admin
   - Liste utilisateurs
   - Formulaire invitation
   - Statistiques

5. **`/organization`** - Configuration org
   - Formulaire organisation
   - Sauvegarde auto

### Exemple authProvider

Voir `IMPLEMENTATION_GUIDE.md` section "AuthProvider à Mettre à Jour"

---

## 📚 Documentation Complète

- **`IMPLEMENTATION_GUIDE.md`** - Guide complet d'implémentation
- **`AUTH_ROUTES.md`** - Documentation des routes d'authentification
- **`replit.md`** - Documentation du projet

---

## 🔒 Sécurité

- ✅ Mots de passe hashés (bcrypt)
- ✅ Sessions sécurisées (HTTP-only cookies)
- ✅ 2FA obligatoire (TOTP)
- ✅ Tokens à usage unique
- ✅ Expiration automatique (7 jours)
- ✅ Séparation admin/user

---

## 🚀 Prochaines Étapes

1. Implémenter les pages frontend listées ci-dessus
2. Tester le flux complet
3. Ajouter les fonctionnalités métier (audits, questionnaires)
4. Déployer en production

---

## 💡 Aide

**Problème de connexion ?**
- Vérifiez les logs: `npm run dev`
- Testez les routes API avec curl
- Consultez IMPLEMENTATION_GUIDE.md

**Besoin de réinitialiser ?**
```bash
# Recréer l'admin
tsx server/scripts/create-admin.ts
```

---

**Système développé pour ADISA - AfricTivistes** 🚀
