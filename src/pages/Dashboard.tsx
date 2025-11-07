import { useEffect, useState } from "react";
import { Users, AlertCircle, MessageSquare, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { RecentIncidents } from "@/components/dashboard/RecentIncidents";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DashboardData {
  activeUsers: number;
  openIncidents: number;
  engagement: number;
  avgQuizScore: number;
  totalMessages?: number;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    activeUsers: 0,
    openIncidents: 0,
    engagement: 0,
    avgQuizScore: 0,
    totalMessages: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiRequest<DashboardData>("/api/admin/overview");
        
        if (response.success && response.data) {
          setData(response.data);
        } else {
          toast({
            title: "Erreur",
            description: response.error || "Impossible de charger les données",
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

    fetchDashboardData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble de la plateforme Shora-Bot
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Utilisateurs actifs"
          value={data.activeUsers.toLocaleString()}
          icon={Users}
          variant="success"
        />
        <StatsCard
          title="Incidents actifs"
          value={data.openIncidents.toString()}
          icon={AlertCircle}
          variant="danger"
        />
        <StatsCard
          title="Messages ce mois"
          value={data.totalMessages?.toLocaleString() || "0"}
          icon={MessageSquare}
          variant="info"
        />
        <StatsCard
          title="Taux d'engagement"
          value={`${data.engagement}%`}
          icon={TrendingUp}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementChart />
        <RecentIncidents />
      </div>
    </div>
  );
};

export default Dashboard;
