import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Incident {
  _id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  reportedAt: string;
  status: "open" | "in-progress" | "resolved";
  userId?: {
    phoneNumber?: string;
    name?: string;
  };
}

const severityColors = {
  low: "bg-info/10 text-info border-info/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-danger/10 text-danger border-danger/20",
  critical: "bg-destructive text-destructive-foreground",
};

const statusColors = {
  open: "bg-muted text-muted-foreground",
  "in-progress": "bg-info/10 text-info border-info/20",
  resolved: "bg-success/10 text-success border-success/20",
};

const statusLabels = {
  open: "Ouvert",
  "in-progress": "En cours",
  resolved: "Résolu",
};

const severityLabels = {
  low: "Faible",
  medium: "Moyen",
  high: "Élevé",
  critical: "Critique",
};

export const RecentIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecentIncidents = async () => {
      try {
        const response = await apiRequest<Incident[]>("/api/admin/incidents?limit=5");
        
        if (response.success && response.data) {
          setIncidents(response.data);
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger les incidents récents",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Erreur de connexion",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecentIncidents();
  }, [toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getReporterInfo = (incident: Incident) => {
    if (incident.userId?.name) {
      return incident.userId.name;
    }
    if (incident.userId?.phoneNumber) {
      return incident.userId.phoneNumber;
    }
    return "Utilisateur inconnu";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-danger" />
            Incidents récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-danger" />
            Incidents récents
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/incidents")}
          >
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {incidents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun incident récent
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident._id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/incidents/${incident._id}`)}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">
                      {incident._id.slice(-6).toUpperCase()}
                    </span>
                    <Badge variant="outline" className={cn(severityColors[incident.severity])}>
                      {severityLabels[incident.severity]}
                    </Badge>
                    <Badge variant="outline" className={cn(statusColors[incident.status])}>
                      {statusLabels[incident.status]}
                    </Badge>
                  </div>
                  <p className="font-medium text-foreground">{incident.type}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {incident.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Signalé par {getReporterInfo(incident)} • {formatDate(incident.reportedAt)}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/incidents/${incident._id}`);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
