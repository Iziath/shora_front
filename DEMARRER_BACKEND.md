# 🚀 Démarrer le Backend SHORA

## ❌ Erreur : ERR_CONNECTION_REFUSED

Si vous voyez cette erreur dans la console :
```
GET http://localhost:3000/api/admin/incidents?limit=20&status=open,in-progress net::ERR_CONNECTION_REFUSED
```

Cela signifie que **le backend SHORA n'est pas démarré**.

## ✅ Solution : Démarrer le backend

### Étape 1 : Ouvrir un terminal dans le dossier `backend/`

```bash
cd backend
```

### Étape 2 : Vérifier que les dépendances sont installées

```bash
npm install
```

### Étape 3 : Vérifier le fichier `.env`

Assurez-vous que `backend/.env` existe et contient au minimum :

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shora-bot
PORT=3000
JWT_SECRET=votre_secret_jwt
ADMIN_EMAIL=admin@shora.com
ADMIN_PASSWORD=votre_mot_de_passe
```

### Étape 4 : Démarrer le backend

```bash
npm run dev
```

Vous devriez voir :
```
✅ MongoDB connecté
✅ Serveur Express démarré sur le port 3000
✅ BOT SHORA PRÊT !
```

### Étape 5 : Vérifier que le backend fonctionne

Ouvrez dans votre navigateur : `http://localhost:3000/api/health`

Vous devriez voir :
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

## 📝 Note importante

**Vous devez démarrer 3 serveurs en parallèle** :

1. **Backend SHORA** (port 3000) : `cd backend && npm run dev`
2. **Backend Quran_back** (port 3001) : `cd Quran_back && npm run dev`
3. **Frontend SHORA** (port 5173) : `cd shora_SH && npm run dev`

## 🔍 Vérification rapide

- Backend SHORA : `http://localhost:3000/api/health` → Devrait retourner `{"status": "ok"}`
- Backend Quran_back : `http://localhost:3001/` → Devrait retourner `{"message": "Bienvenu sur l'API QuranConnect"}`
- Frontend : `http://localhost:5173` → Dashboard SHORA

