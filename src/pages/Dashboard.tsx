import { Users, AlertCircle, MessageSquare, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { RecentIncidents } from "@/components/dashboard/RecentIncidents";

const Dashboard = () => {
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
          title="Utilisateurs totaux"
          value="1,247"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          variant="success"
        />
        <StatsCard
          title="Incidents actifs"
          value="8"
          icon={AlertCircle}
          trend={{ value: 3, isPositive: false }}
          variant="danger"
        />
        <StatsCard
          title="Messages ce mois"
          value="3,429"
          icon={MessageSquare}
          trend={{ value: 8, isPositive: true }}
          variant="info"
        />
        <StatsCard
          title="Taux d'engagement"
          value="87%"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
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
