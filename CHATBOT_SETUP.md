# Configuration du Chatbot (Quran_back)

Le chatbot du dashboard SHORA utilise l'API de `Quran_back`. Vous devez donc lancer **deux serveurs** en parallèle.

## 🚀 Démarrage

### 1. Backend SHORA (port 3000 par défaut)
```bash
cd backend
npm run dev
```

### 2. Backend Quran_back (port 3000 par défaut - peut être changé)
```bash
cd Quran_back
npm run dev
```

⚠️ **Attention** : Si les deux serveurs utilisent le port 3000, vous devez changer le port de l'un d'eux.

### 3. Frontend SHORA
```bash
cd shora_SH
npm run dev
```

## ⚙️ Configuration des ports

### Option 1 : Changer le port de Quran_back

Dans `Quran_back/.env` :
```env
PORT=3001
```

Puis dans `shora_SH/.env` :
```env
VITE_QURAN_API_URL=http://localhost:3001
```

### Option 2 : Changer le port du backend SHORA

Dans `backend/.env` :
```env
PORT=3001
```

Puis dans `shora_SH/.env` :
```env
VITE_API_URL=http://localhost:3001
VITE_QURAN_API_URL=http://localhost:3000
```

## 📝 Variables d'environnement

### `shora_SH/.env`
```env
# API SHORA (gestion utilisateurs, broadcasts, etc.)
VITE_API_URL=http://localhost:3000

# API Quran_back (chatbot)
VITE_QURAN_API_URL=http://localhost:3000
```

### `Quran_back/.env`
```env
PORT=3000
# ... autres variables (MongoDB, etc.)
```

## ✅ Vérification

1. Backend SHORA : `http://localhost:3000/api/health`
2. Backend Quran_back : `http://localhost:3000/` (devrait retourner un message de bienvenue)
3. Frontend SHORA : Ouvrir le dashboard et cliquer sur l'icône de chat (en bas à droite)

## 🔧 Dépannage

### Erreur : "Cannot connect to Quran_back API"
- Vérifiez que `Quran_back` est bien lancé
- Vérifiez le port dans `VITE_QURAN_API_URL`
- Vérifiez que MongoDB est connecté pour `Quran_back`

### Erreur : "Port already in use"
- Changez le port de l'un des deux backends
- Mettez à jour les variables d'environnement correspondantes

