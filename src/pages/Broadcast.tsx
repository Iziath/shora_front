import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Radio, Send, Clock, Users, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { cn } from "@/lib/utils";

interface BroadcastHistory {
  _id: string;
  subject: string;
  message: string;
  status: "pending" | "sending" | "completed" | "failed";
  totalRecipients: number;
  successCount: number;
  errorCount: number;
  scheduledTime: string | null;
  scheduledSlot: string | null;
  sentAt: string | null;
  createdAt: string;
}

const professionLabels: Record<string, string> = {
  maçon: "Maçon",
  électricien: "Électricien",
  plombier: "Plombier",
  charpentier: "Charpentier",
  peintre: "Peintre",
  manœuvre: "Manœuvre",
  autre: "Autre",
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  sending: "En cours",
  completed: "Terminé",
  failed: "Échoué",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  sending: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  failed: "bg-red-500/10 text-red-500 border-red-500/20",
};

const Broadcast = () => {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [language, setLanguage] = useState("fr");
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [targetLanguage, setTargetLanguage] = useState<string>("all");
  const [sendAsAudio, setSendAsAudio] = useState(false);
  const [scheduledSlot, setScheduledSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<BroadcastHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [userStats, setUserStats] = useState({ total: 0, active: 0 });
  const { toast } = useToast();

  const professions = ["maçon", "électricien", "plombier", "charpentier", "peintre", "manœuvre", "autre"];

  useEffect(() => {
    fetchHistory();
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await apiRequest<{
        total: number;
        active: number;
        inactive: number;
      }>("/api/admin/users/stats");

      if (response.success && response.data) {
        setUserStats({
          total: response.data.total || 0,
          active: response.data.active || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
      // En cas d'erreur, garder les valeurs par défaut
      setUserStats({ total: 0, active: 0 });
    }
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await apiRequest<BroadcastHistory[]>("/api/admin/broadcast/history?limit=10");

      if (response.success && response.data) {
        setHistory(Array.isArray(response.data) ? response.data : []);
      } else {
        setHistory([]);
      }
    } catch (error: any) {
      // Ne pas logger les erreurs de connexion (backend non démarré)
      // apiRequest gère déjà ces erreurs silencieusement
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const [estimatedRecipients, setEstimatedRecipients] = useState(0);

  useEffect(() => {
    const calculateRecipients = async () => {
      try {
        const params = new URLSearchParams();
        params.append("limit", "1"); // On veut juste le count
        params.append("isActive", "true");
        
        if (selectedProfessions.length > 0) {
          // Envoyer les professions séparées par des virgules
          params.append("profession", selectedProfessions.join(","));
        }
        
        if (targetLanguage !== "all") {
          params.append("language", targetLanguage);
        }

        const response = await apiRequest<{
          data: any[];
          pagination?: { total: number };
        }>(`/api/admin/users?${params.toString()}`);

        if (response.success && response.data) {
          // La réponse peut avoir une structure différente
          const pagination = (response.data as any).pagination;
          if (pagination?.total !== undefined) {
            setEstimatedRecipients(pagination.total);
            return;
          }
        }
        
        // Fallback: estimation basée sur les stats
        calculateFallbackEstimate();
      } catch (error: any) {
        // Fallback en cas d'erreur (backend non démarré)
        // Ne pas logger les erreurs de connexion
        calculateFallbackEstimate();
      }
    };

    const calculateFallbackEstimate = () => {
      let estimated = userStats.active;
      if (selectedProfessions.length > 0) {
        estimated = Math.floor((userStats.active * selectedProfessions.length) / professions.length);
      }
      if (targetLanguage !== "all") {
        estimated = Math.floor(estimated / 3);
      }
      setEstimatedRecipients(estimated);
    };

    calculateRecipients();
  }, [selectedProfessions, targetLanguage, userStats]);

  const handleProfessionToggle = (profession: string) => {
    setSelectedProfessions((prev) =>
      prev.includes(profession)
        ? prev.filter((p) => p !== profession)
        : [...prev, profession]
    );
  };

  const handleSubmit = async (e: React.FormEvent, immediate: boolean) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Erreur",
        description: "Le message ne peut pas être vide",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest<{
        broadcastId: string;
        total: number;
        scheduledTime: string | null;
        scheduledSlot: string | null;
        status: string;
      }>("/api/admin/broadcast", {
        method: "POST",
        body: JSON.stringify({
          message: message.trim(),
          subject: subject.trim(),
          language: language, // Langue du message (fr, fon, yoruba)
          targetProfessions: selectedProfessions.length > 0 ? selectedProfessions : undefined,
          targetLanguage: targetLanguage !== "all" ? targetLanguage : undefined,
          sendAsAudio,
          scheduledSlot: immediate ? null : scheduledSlot,
        }),
      });

      if (response.success) {
        toast({
          title: "Succès",
          description: immediate
            ? `Message envoyé à ${response.data?.total || 0} utilisateur(s)`
            : `Message programmé pour ${scheduledSlot || "plus tard"}`,
        });
        setMessage("");
        setSubject("");
        setScheduledSlot(null);
        fetchHistory();
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible d'envoyer le message",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Radio className="h-8 w-8 text-primary" />
          Diffusion de messages
        </h1>
        <p className="text-muted-foreground mt-1">
          Envoyer des messages groupés aux utilisateurs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Composer un message</CardTitle>
              <CardDescription>
                Rédigez votre message de diffusion en français, fon ou yoruba
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue du message</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="fon">Fon</SelectItem>
                      <SelectItem value="yoruba">Yoruba</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet (optionnel)</Label>
                  <Input
                    id="subject"
                    placeholder="Ex: Rappel de sécurité"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Rédigez votre message ici..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    className="resize-none"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {message.length} / 1000 caractères
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="audio"
                    checked={sendAsAudio}
                    onCheckedChange={(checked) => setSendAsAudio(checked === true)}
                  />
                  <label
                    htmlFor="audio"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Envoyer en audio
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="submit"
                    className="flex-1 gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Envoyer maintenant
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={(e) => {
                      if (!scheduledSlot) {
                        toast({
                          title: "Erreur",
                          description: "Sélectionnez un créneau horaire",
                          variant: "destructive",
                        });
                        return;
                      }
                      handleSubmit(e, false);
                    }}
                    disabled={isSubmitting || !scheduledSlot}
                  >
                    <Clock className="h-4 w-4" />
                    Programmer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Destinataires
              </CardTitle>
              <CardDescription>
                Sélectionnez les groupes de destinataires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Langue cible</Label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les langues</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="fon">Fon</SelectItem>
                    <SelectItem value="yoruba">Yoruba</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Professions</Label>
                {professions.map((profession) => (
                  <div key={profession} className="flex items-center space-x-2">
                    <Checkbox
                      id={profession}
                      checked={selectedProfessions.includes(profession)}
                      onCheckedChange={() => handleProfessionToggle(profession)}
                    />
                    <label
                      htmlFor={profession}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {professionLabels[profession] || profession}
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Total estimé</p>
                <p className="text-3xl font-bold text-primary">
                  {estimatedRecipients}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  utilisateurs recevront ce message
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Programmation</CardTitle>
              <CardDescription>
                Sélectionnez un créneau horaire pour programmer l'envoi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-colors",
                    scheduledSlot === "7h"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  )}
                  onClick={() => setScheduledSlot(scheduledSlot === "7h" ? null : "7h")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">7h00</p>
                      <p className="text-xs text-muted-foreground">Matin</p>
                    </div>
                    {scheduledSlot === "7h" && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-colors",
                    scheduledSlot === "12h-14h"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  )}
                  onClick={() =>
                    setScheduledSlot(scheduledSlot === "12h-14h" ? null : "12h-14h")
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">12h00 - 14h00</p>
                      <p className="text-xs text-muted-foreground">Midi</p>
                    </div>
                    {scheduledSlot === "12h-14h" && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-colors",
                    scheduledSlot === "18h"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  )}
                  onClick={() => setScheduledSlot(scheduledSlot === "18h" ? null : "18h")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">18h00</p>
                      <p className="text-xs text-muted-foreground">Soir</p>
                    </div>
                    {scheduledSlot === "18h" && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Messages récents</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Aucun message envoyé
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  {history.map((broadcast) => (
                    <div key={broadcast._id} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">
                          {broadcast.subject || "Sans sujet"}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn(statusColors[broadcast.status])}
                        >
                          {statusLabels[broadcast.status]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                        {broadcast.message}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {broadcast.scheduledSlot
                            ? `Programmé: ${broadcast.scheduledSlot}`
                            : formatDate(broadcast.sentAt || broadcast.createdAt)}
                        </span>
                        <span>
                          {broadcast.successCount || 0}/{broadcast.totalRecipients}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
