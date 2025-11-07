import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { name: "Lun", messages: 45, incidents: 2 },
  { name: "Mar", messages: 52, incidents: 1 },
  { name: "Mer", messages: 49, incidents: 3 },
  { name: "Jeu", messages: 63, incidents: 2 },
  { name: "Ven", messages: 58, incidents: 1 },
  { name: "Sam", messages: 35, incidents: 0 },
  { name: "Dim", messages: 28, incidents: 1 },
];

export const EngagementChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement hebdomadaire</CardTitle>
        <CardDescription>Messages et incidents des 7 derniers jours</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}>
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
