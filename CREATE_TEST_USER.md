# Créer un utilisateur de test

Ce guide vous explique comment créer un utilisateur de test pour accéder au dashboard SHORA.

## Configuration

Le système utilise MongoDB avec JWT pour l'authentification. Les identifiants sont configurés dans le fichier `.env` du backend.

### Étape 1 : Configurer le backend

Dans le fichier `.env` du dossier `backend/`, configurez :

```env
ADMIN_EMAIL=admin@shora.com
ADMIN_PASSWORD=admin123
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### Étape 2 : Configurer le frontend

Dans le fichier `.env` du dossier `shora_SH/`, configurez :

```env
VITE_API_URL=http://localhost:3000
```

### Étape 3 : Démarrer le backend

```bash
cd backend
npm run dev
```

Le backend doit être démarré pour que l'authentification fonctionne.

## Identifiants de connexion par défaut

Une fois le backend configuré, vous pouvez vous connecter avec :

- **Email**: `admin@shora.com`
- **Password**: `admin123`

Ces valeurs peuvent être modifiées dans le fichier `.env` du backend.

## Connexion

1. Allez sur la page `/auth`
2. Entrez l'email et le mot de passe configurés
3. Vous serez redirigé vers le dashboard après une connexion réussie

## Modifier les identifiants

Pour changer l'email ou le mot de passe, modifiez les variables dans `backend/.env` :

```env
ADMIN_EMAIL=votre-email@exemple.com
ADMIN_PASSWORD=votre-mot-de-passe
```

Puis redémarrez le serveur backend.

## Note

Le mot de passe est automatiquement hashé avec bcrypt lors de la première connexion. Le hash est stocké dans la variable `ADMIN_PASSWORD_HASH` si vous voulez le pré-configurer.
