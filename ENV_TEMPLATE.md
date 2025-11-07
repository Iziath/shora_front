# Configuration des Variables d'Environnement - Frontend

Créez un fichier `.env` dans le dossier `shora_SH/` avec le contenu suivant :

```env
# ============================================
# Configuration API Backend
# ============================================
# URL de l'API backend
# En développement: http://localhost:3000
# En production: https://votre-domaine.com/api
VITE_API_URL=http://localhost:3000
```

## Instructions

1. Copiez le contenu ci-dessus dans un nouveau fichier nommé `.env` dans le dossier `shora_SH/`
2. Remplacez toutes les valeurs par vos propres configurations
3. **Important** : Ne commitez jamais le fichier `.env` dans Git (il est déjà dans `.gitignore`)

## Variables Requises

### API Backend
- `VITE_API_URL` : URL de l'API backend (pour les appels API depuis le frontend)

## Note

Toutes les variables d'environnement dans Vite doivent être préfixées par `VITE_` pour être accessibles dans le code frontend.

**Note importante** : Ce projet utilise MongoDB pour la base de données et l'authentification. Supabase n'est plus utilisé.
