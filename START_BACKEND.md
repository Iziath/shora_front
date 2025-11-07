# Démarrer le Backend

## Problème : ERR_CONNECTION_REFUSED

Si vous voyez l'erreur `ERR_CONNECTION_REFUSED`, cela signifie que le backend n'est pas démarré ou n'est pas accessible.

## Solution : Démarrer le backend

### 1. Ouvrir un nouveau terminal

Ouvrez un nouveau terminal dans le dossier `backend/` (pas dans `shora_SH/`).

### 2. Installer les dépendances (si nécessaire)

```bash
cd backend
npm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `backend/` avec :

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/shora

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Admin
ADMIN_EMAIL=admin@shora.com
ADMIN_PASSWORD=admin123

# WhatsApp - Notifications
SUPERVISOR_PHONES=+229XXXXXXXX,+229YYYYYYYY

# Port
PORT=3000
```

### 4. Démarrer le backend

```bash
npm run dev
```

ou

```bash
node server.js
```

### 5. Vérifier que le backend fonctionne

Vous devriez voir dans la console :
```
✅ MongoDB connecté avec succès
🚀 Serveur démarré sur le port 3000
```

### 6. Tester la connexion

Ouvrez votre navigateur et allez sur : `http://localhost:3000/health`

Vous devriez voir :
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

## Note importante

Le frontend (dans `shora_SH/`) et le backend (dans `backend/`) doivent être démarrés **en même temps** dans **deux terminaux différents** :

- Terminal 1 : `cd backend && npm run dev`
- Terminal 2 : `cd shora_SH && npm run dev`

## Configuration du frontend

Assurez-vous que le fichier `.env` dans `shora_SH/` contient :

```env
VITE_API_URL=http://localhost:3000
```

Si le backend est sur un autre port, modifiez cette valeur en conséquence.

