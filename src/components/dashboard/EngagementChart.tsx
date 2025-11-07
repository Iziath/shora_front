import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface EngagementData {
  interactions: Array<{ _id: string; count: number }>;
  activeUsers: Array<{ _id: string; count: number }>;
  incidents: Array<{ _id: string; count: number }>;
}

export const EngagementChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEngagementData = async () => {
      try {
        const response = await apiRequest<EngagementData>("/api/admin/engagement");
        
        if (response.success && response.data) {
          // Transformer les données pour le graphique
          const interactionsMap = new Map(
            response.data.interactions.map(item => [item._id, item.count])
          );
          const usersMap = new Map(
            response.data.activeUsers.map(item => [item._id, item.count])
          );
          const incidentsMap = new Map(
            (response.data.incidents || []).map(item => [item._id, item.count])
          );
          
          // Créer un ensemble de toutes les dates
          const allDates = new Set([
            ...response.data.interactions.map(item => item._id),
            ...response.data.activeUsers.map(item => item._id),
            ...(response.data.incidents || []).map(item => item._id)
          ]);
          
          // Transformer en format pour le graphique (7 derniers jours)
          const sortedDates = Array.from(allDates).sort().slice(-7);
          const chartData = sortedDates.map(date => {
            const dateObj = new Date(date);
            const dayName = dateObj.toLocaleDateString('fr-FR', { weekday: 'short' });
            
            return {
              name: dayName,
              date: date,
              messages: interactionsMap.get(date) || 0,
              incidents: incidentsMap.get(date) || 0,
            };
          });
          
          setData(chartData);
        }
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données d'engagement",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEngagementData();
  }, [toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement hebdomadaire</CardTitle>
          <CardDescription>Messages et incidents des 7 derniers jours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement hebdomadaire</CardTitle>
        <CardDescription>Messages et incidents des 7 derniers jours</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="messages" 
              stroke="hsl(var(--shora-primary))" 
              strokeWidth={2}
              name="Messages"
            />
            <Line 
              type="monotone" 
              dataKey="incidents" 
              stroke="hsl(var(--shora-danger))" 
              strokeWidth={2}
              name="Incidents"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
