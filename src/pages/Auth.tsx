import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logo from "../../assets/image/logo_shora.png";

const Auth = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(loginEmail, loginPassword);

      if (!response.success) {
        throw new Error(response.error || "Erreur de connexion");
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur SHORA",
      });
      
      // Mettre à jour l'utilisateur dans le contexte
      if ((window as any).__updateAuthUser && response.data?.user) {
        (window as any).__updateAuthUser(response.data.user);
      }
      
      // Rediriger vers le dashboard
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants invalides",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-petrol p-4">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(245,233,214,0.12),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-y-0 right-[-40%] w-[70%] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(246,139,31,0.15),rgba(15,61,76,0.1))] blur-3xl" />
      
      <Card className="w-full max-w-md relative z-10 border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <img
                src={logo}
                alt="SHORA Logo"
                className="h-12 w-auto"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-display text-snow">SHORA</CardTitle>
          <CardDescription className="text-sand/80">
            Plateforme de gestion santé & sécurité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-signin" className="text-sand/90">Email</Label>
              <Input
                id="email-signin"
                type="email"
                placeholder="admin@shora.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-white/5 border-white/10 text-snow placeholder:text-sand/50 focus:border-safety"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-signin" className="text-sand/90">Mot de passe</Label>
              <PasswordInput
                id="password-signin"
                placeholder="Entrez votre mot de passe"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="bg-white/5 border-white/10 text-snow placeholder:text-sand/50 focus:border-safety"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-safety text-petrol hover:bg-[#ffa248] font-medium shadow-[0_18px_40px_-18px_rgba(246,139,31,0.9)]" 
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
