import { ReactNode, useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { MessageSquare } from "lucide-react";
import ChatPanel from "@/components/chat/ChatPanel";
import { useTheme } from "next-themes";
import { useSearchParams } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Déterminer le thème actuel (gérer le cas où theme est undefined)
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const chatTheme = (currentTheme || 'light') as 'light' | 'dark';

  // Ouvrir automatiquement le chatbot si le paramètre ?chat=open est présent dans l'URL
  useEffect(() => {
    const chatParam = searchParams.get('chat');
    if (chatParam === 'open') {
      setIsChatOpen(true);
      // Nettoyer l'URL pour ne pas garder le paramètre après ouverture
      searchParams.delete('chat');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>

        {/* Bouton flottant pour ouvrir le chatbot */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 z-30 group"
          aria-label="Ouvrir le chatbot SHORA"
        >
          <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
          {/* Badge de notification (optionnel) */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
        </button>

        {/* Panel du chatbot */}
        <ChatPanel
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          theme={chatTheme}
        />
      </div>
    </SidebarProvider>
  );
};
