import { useState, useEffect, useRef } from "react";
import ChatPanel from "@/components/chat/ChatPanel";
import { useTheme } from "next-themes";
import { Shield } from "lucide-react";

/**
 * Page publique du chatbot SHORA
 * Accessible sans authentification, optimisée pour mobile
 * URL: /chatbot
 */
const ChatbotPublic = () => {
  const [isChatOpen, setIsChatOpen] = useState(true); // Toujours ouvert sur cette page
  const { theme, systemTheme } = useTheme();
  
  // Déterminer le thème actuel
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const chatTheme = (currentTheme || 'light') as 'light' | 'dark';

  // Ouvrir automatiquement le chatbot au chargement
  useEffect(() => {
    setIsChatOpen(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* En-tête simple pour mobile */}
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">SHORA</h1>
            <p className="text-xs text-white/90">Assistant de sécurité</p>
          </div>
        </div>
      </header>

      {/* Zone principale - le chatbot prend tout l'espace */}
      <div className="flex-1 relative overflow-hidden">
        <ChatPanel
          isOpen={isChatOpen}
          onClose={() => {
            // Ne pas permettre la fermeture sur la page publique
            // Le chatbot reste toujours ouvert
          }}
          theme={chatTheme}
        />
      </div>
    </div>
  );
};

export default ChatbotPublic;

