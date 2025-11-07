import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Loader2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Incident {
  _id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  location: string;
  status: "open" | "in-progress" | "resolved" | "false-alarm";
  reportedAt: string;
  userId?: {
    name?: string;
    phoneNumber?: string;
    profession?: string;
  };
}

const severityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusColors = {
  open: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  resolved: "bg-green-500/10 text-green-500 border-green-500/20",
  "false-alarm": "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

const severityLabels = {
  low: "Faible",
  medium: "Moyenne",
  high: "Élevée",
  critical: "Critique",
};

const statusLabels = {
  open: "Ouvert",
  "in-progress": "En cours",
  resolved: "Résolu",
  "false-alarm": "Fausse alerte",
};

const typeLabels: Record<string, string> = {
  danger: "Danger",
  accident: "Accident",
  "near-miss": "Presque accident",
  equipment: "Équipement",
};

const Incidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (severityFilter !== "all") {
        params.append("severity", severityFilter);
      }

      const response = await apiRequest<{
        data: Incident[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      }>(`/api/admin/incidents?${params.toString()}`);

      if (response.success && response.data) {
        setIncidents(response.data.data || []);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotal(response.data.pagination?.total || 0);
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible de charger les incidents",
          variant: "destructive",
        });
        setIncidents([]);
      }
    } catch (error: any) {
      console.error("Error fetching incidents:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des incidents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [page, statusFilter, severityFilter]);

  // Filtrer les incidents par terme de recherche
  const filteredIncidents = incidents.filter((incident) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      incident.description?.toLowerCase().includes(search) ||
      incident.location?.toLowerCase().includes(search) ||
      incident.userId?.name?.toLowerCase().includes(search) ||
      incident.userId?.phoneNumber?.includes(search) ||
      typeLabels[incident.type]?.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString: string) => {
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Incidents</h1>
          <p className="text-muted-foreground mt-1">
            {total} incident{total !== 1 ? "s" : ""} signalé{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button className="gap-2" onClick={() => fetchIncidents()}>
          <Plus className="h-4 w-4" />
          Actualiser
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="open">Ouvert</SelectItem>
                <SelectItem value="in-progress">En cours</SelectItem>
                <SelectItem value="resolved">Résolu</SelectItem>
                <SelectItem value="false-alarm">Fausse alerte</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Gravité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les gravités</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucun incident trouvé
            </div>
          ) : (
            <>
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
                  {filteredIncidents.map((incident) => (
                    <TableRow key={incident._id}>
                      <TableCell className="font-mono text-sm">
                        {incident._id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        {typeLabels[incident.type] || incident.type}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(severityColors[incident.severity] || severityColors.medium)}
                        >
                          {severityLabels[incident.severity] || incident.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">
                            {incident.userId?.name || "Anonyme"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {incident.userId?.phoneNumber || "N/A"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {incident.location || "Non spécifié"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(incident.reportedAt)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            statusColors[incident.status] || statusColors.open
                          )}
                        >
                          {statusLabels[incident.status] || incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {page} sur {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Incidents;
