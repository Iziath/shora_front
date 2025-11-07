import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, UserCheck, Upload, Loader2, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface User {
  _id: string;
  name: string;
  phoneNumber: string;
  profession: string;
  language: string;
  isActive: boolean;
  lastInteraction: string;
  createdAt: string;
  medicalHistory?: {
    allergies?: string;
    chronicDiseases?: string;
    medications?: string;
    bloodType?: string;
    emergencyContact?: {
      name?: string;
      phone?: string;
      relationship?: string;
    };
    notes?: string;
  };
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

const languageLabels: Record<string, string> = {
  fr: "Français",
  fon: "Fon",
  yoruba: "Yoruba",
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [professionFilter, setProfessionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ total: 0, active: 0, newThisMonth: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Formulaire
  const [formData, setFormData] = useState({
    phoneNumber: "",
    name: "",
    profession: "autre",
    language: "fr",
    allergies: "",
    chronicDiseases: "",
    medications: "",
    bloodType: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    medicalNotes: "",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      if (professionFilter !== "all") {
        params.append("profession", professionFilter);
      }
      if (statusFilter !== "all") {
        params.append("isActive", statusFilter === "active" ? "true" : "false");
      }

      const token = localStorage.getItem("auth_token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      
      const fetchResponse = await fetch(`${API_URL}/api/admin/users?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const jsonData = await fetchResponse.json();

      if (fetchResponse.ok && jsonData.success) {
        // Le backend retourne { success: true, data: users[], pagination: {...} }
        const usersData = jsonData.data || [];
        const paginationData = jsonData.pagination || {};
        
        setUsers(usersData);
        setTotalPages(paginationData.pages || 1);
        setTotal(paginationData.total || 0);
      } else {
        toast({
          title: "Erreur",
          description: jsonData.error || "Impossible de charger les utilisateurs",
          variant: "destructive",
        });
        setUsers([]);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des utilisateurs",
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiRequest<{
        total: number;
        active: number;
        inactive: number;
      }>("/api/admin/users/stats");

      if (response.success && response.data) {
        const thisMonth = new Date();
        thisMonth.setDate(1);
        // Pour l'instant, on utilise une estimation
        setStats({
          total: response.data.total || 0,
          active: response.data.active || 0,
          newThisMonth: 0, // TODO: Calculer les nouveaux ce mois
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      // En cas d'erreur, on garde les valeurs par défaut
      setStats({ total: 0, active: 0, newThisMonth: 0 });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [page, professionFilter, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const medicalHistory = {
        allergies: formData.allergies,
        chronicDiseases: formData.chronicDiseases,
        medications: formData.medications,
        bloodType: formData.bloodType && formData.bloodType !== "none" ? formData.bloodType : undefined,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship,
        },
        notes: formData.medicalNotes,
      };

      const response = await apiRequest<User>("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          name: formData.name,
          profession: formData.profession,
          language: formData.language,
          medicalHistory,
        }),
      });

      if (response.success) {
        toast({
          title: "Succès",
          description: "Utilisateur créé avec succès",
        });
        setIsDialogOpen(false);
        resetForm();
        // Réinitialiser les filtres et revenir à la page 1 pour voir le nouvel utilisateur
        setPage(1);
        setProfessionFilter("all");
        setStatusFilter("all");
        setSearchTerm("");
        // Attendre un peu avant de rafraîchir pour que le backend ait le temps de sauvegarder
        setTimeout(() => {
          fetchUsers();
          fetchStats();
        }, 500);
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible de créer l'utilisateur",
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

  const handleImport = async (file: File) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("auth_token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(`${API_URL}/api/admin/users/import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Import réussi",
          description: `${data.data.imported} utilisateur(s) importé(s) sur ${data.data.total}`,
        });
        if (data.data.errors && data.data.errors.length > 0) {
          console.warn("Erreurs d'import:", data.data.errors);
        }
        setIsImportDialogOpen(false);
        // Réinitialiser les filtres et revenir à la page 1
        setPage(1);
        setProfessionFilter("all");
        setStatusFilter("all");
        setSearchTerm("");
        setTimeout(() => {
          fetchUsers();
          fetchStats();
        }, 500);
      } else {
        toast({
          title: "Erreur d'import",
          description: data.error || "Impossible d'importer le fichier",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'import",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      phoneNumber: "",
      name: "",
      profession: "autre",
      language: "fr",
      allergies: "",
      chronicDiseases: "",
      medications: "",
      bloodType: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      medicalNotes: "",
    });
  };

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.phoneNumber?.includes(search) ||
      professionLabels[user.profession]?.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
    return "Récemment";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Utilisateurs</h1>
          <p className="text-muted-foreground mt-1">
            {total} utilisateur{total !== 1 ? "s" : ""} enregistré{total !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Importer Excel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importer des utilisateurs</DialogTitle>
                <DialogDescription>
                  Téléchargez un fichier Excel (.xlsx, .xls) ou CSV (.csv) avec les colonnes suivantes :
                  phoneNumber, name, profession, language, allergies, chronicDiseases, medications, bloodType, emergencyContactName, emergencyContactPhone, emergencyContactRelationship, medicalNotes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImport(file);
                    }
                  }}
                  disabled={isSubmitting}
                />
                {isSubmitting && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Import en cours...
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvel utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouvel utilisateur</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouvel utilisateur avec ses informations et antécédents médicaux
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Téléphone *</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                      placeholder="+229XXXXXXXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Select
                      value={formData.profession}
                      onValueChange={(value) =>
                        setFormData({ ...formData, profession: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(professionLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) =>
                        setFormData({ ...formData, language: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(languageLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Antécédents médicaux</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Input
                        id="allergies"
                        value={formData.allergies}
                        onChange={(e) =>
                          setFormData({ ...formData, allergies: e.target.value })
                      }
                        placeholder="Ex: Pénicilline, Pollen..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chronicDiseases">Maladies chroniques</Label>
                      <Input
                        id="chronicDiseases"
                        value={formData.chronicDiseases}
                        onChange={(e) =>
                          setFormData({ ...formData, chronicDiseases: e.target.value })
                        }
                        placeholder="Ex: Diabète, Hypertension..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="medications">Médicaments en cours</Label>
                        <Input
                          id="medications"
                          value={formData.medications}
                          onChange={(e) =>
                            setFormData({ ...formData, medications: e.target.value })
                          }
                          placeholder="Ex: Insuline, Aspirine..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bloodType">Groupe sanguin</Label>
                        <Select
                          value={formData.bloodType || "none"}
                          onValueChange={(value) =>
                            setFormData({ ...formData, bloodType: value === "none" ? "" : value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Non renseigné</SelectItem>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Contact d'urgence</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactName">Nom</Label>
                          <Input
                            id="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                emergencyContactName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactPhone">Téléphone</Label>
                          <Input
                            id="emergencyContactPhone"
                            value={formData.emergencyContactPhone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                emergencyContactPhone: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactRelationship">Lien</Label>
                          <Input
                            id="emergencyContactRelationship"
                            value={formData.emergencyContactRelationship}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                emergencyContactRelationship: e.target.value,
                              })
                            }
                            placeholder="Ex: Époux, Frère..."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medicalNotes">Notes médicales</Label>
                      <Textarea
                        id="medicalNotes"
                        value={formData.medicalNotes}
                        onChange={(e) =>
                          setFormData({ ...formData, medicalNotes: e.target.value })
                        }
                        rows={3}
                        placeholder="Autres informations médicales importantes..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      "Créer"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total utilisateurs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taux d'activité</p>
                <p className="text-2xl font-bold">
                  {stats.total > 0
                    ? Math.round((stats.active / stats.total) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={professionFilter} onValueChange={setProfessionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les professions</SelectItem>
                {Object.entries(professionLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucun utilisateur trouvé
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Profession</TableHead>
                    <TableHead>Langue</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière activité</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {user.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name || "Sans nom"}</p>
                            <p className="text-xs text-muted-foreground">
                              {user._id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {user.phoneNumber}
                      </TableCell>
                      <TableCell>
                        {professionLabels[user.profession] || user.profession}
                      </TableCell>
                      <TableCell>
                        {languageLabels[user.language] || user.language}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.isActive ? "default" : "secondary"}
                        >
                          {user.isActive ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatLastActive(user.lastInteraction)}
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

export default Users;
