import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Incident {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  reporter: string;
  reporterName: string;
  date: string;
  location: string;
  status: "open" | "in-progress" | "resolved";
}

const mockIncidents: Incident[] = [
  {
    id: "INC001",
    type: "Accident de travail",
    severity: "high",
    reporter: "+229 97 12 34 56",
    reporterName: "Jean Kouassi",
    date: "2024-01-15",
    location: "Chantier A - Zone 3",
    status: "in-progress",
  },
  {
    id: "INC002",
    type: "Équipement défectueux",
    severity: "medium",
    reporter: "+229 96 23 45 67",
    reporterName: "Marie Ahoyo",
    date: "2024-01-14",
    location: "Atelier principal",
    status: "open",
  },
  {
    id: "INC003",
    type: "Malaise",
    severity: "critical",
    reporter: "+229 95 34 56 78",
    reporterName: "Ahmed Sow",
    date: "2024-01-13",
    location: "Bureau administratif",
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

const Incidents = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Incidents</h1>
          <p className="text-muted-foreground mt-1">
            Gestion des incidents signalés
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvel incident
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des incidents</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un incident..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Gravité</TableHead>
                <TableHead>Signalé par</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-mono text-sm">
                    {incident.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {incident.type}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(severityColors[incident.severity])}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{incident.reporterName}</p>
                      <p className="text-xs text-muted-foreground">{incident.reporter}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {incident.location}
                  </TableCell>
                  <TableCell className="text-sm">
                    {incident.date}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(statusColors[incident.status])}>
                      {incident.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Incidents;
