import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Incident {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  reporter: string;
  date: string;
  status: "open" | "in-progress" | "resolved";
}

const mockIncidents: Incident[] = [
  {
    id: "INC001",
    type: "Accident de travail",
    severity: "high",
    reporter: "+229 97 12 34 56",
    date: "2024-01-15",
    status: "in-progress",
  },
  {
    id: "INC002",
    type: "Équipement défectueux",
    severity: "medium",
    reporter: "+229 96 23 45 67",
    date: "2024-01-14",
    status: "open",
  },
  {
    id: "INC003",
    type: "Malaise",
    severity: "critical",
    reporter: "+229 95 34 56 78",
    date: "2024-01-13",
    status: "resolved",
  },
];

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
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-danger" />
            Incidents récents
          </CardTitle>
          <Button variant="outline" size="sm">
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockIncidents.map((incident) => (
            <div
              key={incident.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">
                    {incident.id}
                  </span>
                  <Badge variant="outline" className={cn(severityColors[incident.severity])}>
                    {severityLabels[incident.severity]}
                  </Badge>
                  <Badge variant="outline" className={cn(statusColors[incident.status])}>
                    {statusLabels[incident.status]}
                  </Badge>
                </div>
                <p className="font-medium text-foreground">{incident.type}</p>
                <p className="text-sm text-muted-foreground">
                  Signalé par {incident.reporter} • {incident.date}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
