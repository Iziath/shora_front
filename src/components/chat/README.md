# 🤖 Chatbot SHORA - Guide d'intégration

## Vue d'ensemble

Le composant `ShoraChatPanel` est un chatbot IA intégré au dashboard SHORA qui permet aux administrateurs de poser des questions sur la sécurité au travail.

## Installation

Le composant est déjà créé dans `shora_SH/src/components/chat/ShoraChatPanel.tsx`.

## Utilisation

### 1. Importer le composant

```tsx
import ShoraChatPanel from '@/components/chat/ShoraChatPanel';
```

### 2. Ajouter l'état pour contrôler l'ouverture/fermeture

```tsx
const [isChatOpen, setIsChatOpen] = useState(false);
```

### 3. Ajouter un bouton pour ouvrir le chatbot

```tsx
<button
  onClick={() => setIsChatOpen(true)}
  className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg"
>
  <MessageSquare className="h-6 w-6" />
</button>
```

### 4. Rendre le composant

```tsx
<ShoraChatPanel
  isOpen={isChatOpen}
  onClose={() => setIsChatOpen(false)}
  theme="light" // ou "dark"
/>
```

## Exemple complet

```tsx
import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import ShoraChatPanel from '@/components/chat/ShoraChatPanel';

const MyPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Bouton flottant pour ouvrir le chat */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 z-30"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Panel du chatbot */}
      <ShoraChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        theme="light"
      />
    </>
  );
};
```

## Configuration backend

Le backend doit être configuré avec :

1. **Ollama** (optionnel mais recommandé) :
   ```bash
   # Installer Ollama
   # Télécharger depuis https://ollama.ai
   
   # Lancer Ollama
   ollama serve
   
   # Télécharger le modèle
   ollama pull llama3.1
   ```

2. **Variables d'environnement** (`.env`) :
   ```env
   OLLAMA_URL=http://localhost:11434/api/generate
   OLLAMA_MODEL=llama3.1
   USE_OLLAMA=true
   ```

3. **Si Ollama n'est pas disponible** :
   - Le chatbot utilisera des réponses de fallback intelligentes
   - Basées sur des mots-clés (casque, gants, danger, etc.)

## Fonctionnalités

- ✅ Interface moderne avec animations fluides
- ✅ Thème clair/sombre
- ✅ Support texte et audio (à venir)
- ✅ Réponses intelligentes via LLM (Ollama)
- ✅ Réponses de fallback si LLM indisponible
- ✅ Sauvegarde des conversations en base
- ✅ Design responsive

## Personnalisation

### Couleurs

Le chatbot utilise les couleurs SHORA (orange/rouge) pour la sécurité. Pour modifier :

1. Ouvrir `ShoraChatPanel.tsx`
2. Remplacer les classes de couleur :
   - `from-orange-500` → votre couleur
   - `to-red-500` → votre couleur

### Messages

Les messages de bienvenue et d'erreur peuvent être modifiés dans le composant.

## Dépannage

### Le chatbot ne répond pas

1. Vérifier que le backend est démarré
2. Vérifier l'URL de l'API dans `.env` (frontend)
3. Vérifier les logs du backend
4. Vérifier que l'authentification fonctionne (token JWT)

### Ollama ne répond pas

- Le chatbot utilisera automatiquement les réponses de fallback
- Vérifier que Ollama est lancé : `ollama serve`
- Vérifier l'URL dans `.env` : `OLLAMA_URL`

### Erreur CORS

- Vérifier que le backend autorise les requêtes depuis le frontend
- Vérifier `cors` dans `server.js`

## Prochaines étapes

- [ ] Intégrer le chatbot dans le Dashboard
- [ ] Ajouter le support audio (microphone)
- [ ] Ajouter l'historique des conversations
- [ ] Ajouter l'export des conversations
- [ ] Améliorer les réponses avec un meilleur prompt système

