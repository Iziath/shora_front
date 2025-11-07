# 🚀 Déploiement du Frontend - Guide Rapide

## Option 1 : Vercel (Recommandé)

### Étapes

1. **Créer un compte** : https://vercel.com

2. **Importer le projet** :
   - Cliquez sur "Add New Project"
   - Connectez votre repository GitHub
   - Sélectionnez le repository SHORA

3. **Configuration** :
   - **Root Directory** : `shora_SH`
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

4. **Variables d'environnement** :
   - Cliquez sur "Environment Variables"
   - Ajoutez :
     ```
     VITE_API_URL=https://votre-backend.railway.app
     VITE_QURAN_API_URL=https://votre-chatbot-backend.com
     ```

5. **Déployer** :
   - Cliquez sur "Deploy"
   - Vercel déploie automatiquement

6. **Obtenir l'URL** :
   - Vercel génère : `https://votre-projet.vercel.app`
   - **IMPORTANT** : Notez cette URL pour `FRONTEND_URL` dans le backend

---

## Option 2 : Netlify

### Étapes

1. **Créer un compte** : https://netlify.com

2. **Déployer depuis GitHub** :
   - "Add new site" > "Import an existing project"
   - Connectez votre repository

3. **Configuration** :
   - **Base directory** : `shora_SH`
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`

4. **Variables d'environnement** :
   - Site settings > Environment variables
   - Ajoutez les mêmes variables que Vercel

5. **Déployer** :
   - Netlify déploie automatiquement

---

## ⚙️ Configuration Post-Déploiement

Une fois le frontend déployé, **mettez à jour le backend** :

1. Allez dans les variables d'environnement du backend (Railway/Render)
2. Ajoutez ou modifiez :
   ```
   FRONTEND_URL=https://votre-projet.vercel.app
   DASHBOARD_URL=https://votre-projet.vercel.app
   ```
3. Redémarrez le backend

Le QR code pointera maintenant vers votre frontend en production !

---

## ✅ Vérification

1. Ouvrez : `https://votre-projet.vercel.app`
2. Testez la page chatbot : `https://votre-projet.vercel.app/chatbot`
3. Connectez-vous au dashboard
4. Allez sur "Codes QR" et vérifiez que le QR code fonctionne

