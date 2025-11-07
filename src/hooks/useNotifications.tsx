import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  incident_id: string | null;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch notifications (basées sur les incidents récents)
  const fetchNotifications = async () => {
    try {
      // Récupérer les incidents récents non résolus comme notifications
      const response = await apiRequest<{
        data: any[];
        pagination?: any;
      }>("/api/admin/incidents?limit=20&status=open,in-progress");
      
      // Ne pas traiter si le backend n'est pas disponible (erreur silencieuse)
      if (!response.success && response.error?.includes('Backend non disponible')) {
        return; // Sortir silencieusement
      }
      
      if (response.success && response.data) {
        // La réponse peut être un tableau directement ou un objet avec data
        const incidents = Array.isArray(response.data) 
          ? response.data 
          : (response.data.data || []);
        
        // Transformer les incidents en notifications
        const incidentNotifications: Notification[] = incidents.map((incident: any) => ({
          id: incident._id,
          title: `Nouvel incident: ${incident.type || 'Incident'}`,
          message: incident.description || 'Aucune description',
          is_read: false, // Pour l'instant, on considère tous comme non lus
          created_at: incident.reportedAt || new Date().toISOString(),
          incident_id: incident._id,
        }));

        setNotifications(incidentNotifications);
        setUnreadCount(incidentNotifications.length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error: any) {
      // Ne pas logger les erreurs de connexion (backend non démarré)
      // apiRequest gère déjà ces erreurs silencieusement
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read (pour l'instant, on ne fait rien côté backend)
  const markAsRead = async (notificationId: string) => {
    try {
      // Mettre à jour localement
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    fetchNotifications();

    // Polling toutes les 30 secondes pour les nouvelles notifications
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};
