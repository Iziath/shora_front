import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Incidents from "./pages/Incidents";
import Users from "./pages/Users";
import Broadcast from "./pages/Broadcast";
import QRCodePage from "./pages/QRCode";
import ChatbotPublic from "./pages/ChatbotPublic";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout><Dashboard /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/incidents"
              element={
                <ProtectedRoute>
                  <AppLayout><Incidents /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <AppLayout><Users /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/broadcast"
              element={
                <ProtectedRoute>
                  <AppLayout><Broadcast /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/qr"
              element={
                <ProtectedRoute>
                  <AppLayout><QRCodePage /></AppLayout>
                </ProtectedRoute>
              }
            />
            {/* Route publique pour le chatbot (accessible sans authentification) */}
            <Route path="/chatbot" element={<ChatbotPublic />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
