import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, RefreshCw, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const QRCodePage = () => {
  const [chatbotQrData, setChatbotQrData] = useState<{ qrImageUrl: string; chatbotLink: string } | null>(null);
  const [loadingChatbotQR, setLoadingChatbotQR] = useState(false);
  const { toast } = useToast();

  const fetchChatbotQR = async () => {
    try {
      setLoadingChatbotQR(true);
      const response = await apiRequest<{
        qrImageUrl: string;
        chatbotLink: string;
      }>("/api/qr/chatbot/generate");

      if (response.success && response.data) {
        setChatbotQrData(response.data);
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible de générer le QR code du chatbot",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erreur fetchChatbotQR:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le QR code du chatbot. Vérifiez que le backend est démarré.",
        variant: "destructive",
      });
    } finally {
      setLoadingChatbotQR(false);
    }
  };

  useEffect(() => {
    fetchChatbotQR();
  }, []);

  const handleDownloadChatbotQR = () => {
    if (!chatbotQrData?.qrImageUrl) return;
    
    const link = document.createElement("a");
    link.href = chatbotQrData.qrImageUrl;
    link.download = "shora-chatbot-qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <QrCode className="h-8 w-8 text-primary" />
          Codes QR
        </h1>
        <p className="text-muted-foreground mt-1">
          Codes QR pour accéder au chatbot SHORA
        </p>
      </div>

      {/* QR Code du Chatbot (pour téléphone) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📱 QR Code Chatbot (Téléphone)</CardTitle>
          <CardDescription>
            Scannez ce code QR avec votre téléphone pour ouvrir directement le chatbot SHORA dans votre navigateur mobile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
            {loadingChatbotQR ? (
              <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center border-4 border-primary">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : chatbotQrData?.qrImageUrl ? (
              <div className="flex flex-col items-center gap-3">
                <img 
                  src={chatbotQrData.qrImageUrl} 
                  alt="QR Code Chatbot SHORA" 
                  className="w-64 h-64 rounded-lg border-4 border-primary shadow-lg"
                />
                <p className="text-xs text-muted-foreground text-center max-w-xs">
                  📱 Scanner ce code avec votre téléphone pour ouvrir le chatbot
                </p>
              </div>
            ) : (
              <div className="w-64 h-64 bg-white rounded-lg flex flex-col items-center justify-center border-4 border-primary gap-3 p-4">
                <QrCode className="h-32 w-32 text-muted-foreground" />
                <p className="text-xs text-muted-foreground text-center">
                  QR code non disponible
                </p>
              </div>
            )}
          </div>
          <Alert>
            <AlertDescription>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">📱 Comment utiliser :</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Ouvrez l'appareil photo de votre téléphone</li>
                  <li>Scannez ce code QR</li>
                  <li>Le chatbot SHORA s'ouvrira directement dans votre navigateur</li>
                  <li>Commencez à chatter immédiatement - <strong>aucune authentification requise !</strong></li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button className="flex-1 gap-2" onClick={fetchChatbotQR} disabled={loadingChatbotQR}>
              <RefreshCw className={`h-4 w-4 ${loadingChatbotQR ? 'animate-spin' : ''}`} />
              Régénérer
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 gap-2" 
              onClick={handleDownloadChatbotQR}
              disabled={!chatbotQrData?.qrImageUrl}
            >
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default QRCodePage;
