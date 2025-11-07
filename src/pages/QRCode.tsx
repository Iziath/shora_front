import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const QRCodePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <QrCode className="h-8 w-8 text-primary" />
          Code QR WhatsApp
        </h1>
        <p className="text-muted-foreground mt-1">
          Connexion du bot WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scanner le code QR</CardTitle>
            <CardDescription>
              Utilisez WhatsApp pour scanner ce code et connecter le bot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
              <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center border-4 border-primary">
                <QrCode className="h-48 w-48 text-muted-foreground" />
              </div>
            </div>

            <Alert>
              <AlertDescription>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Ouvrez WhatsApp sur votre téléphone</li>
                  <li>Allez dans Paramètres {">"} Appareils connectés</li>
                  <li>Appuyez sur "Connecter un appareil"</li>
                  <li>Scannez ce code QR</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <RefreshCw className="h-4 w-4" />
                Régénérer
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Download className="h-4 w-4" />
                Télécharger
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>État de la connexion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg border border-success/20">
                <div>
                  <p className="font-medium text-success">Connecté</p>
                  <p className="text-sm text-muted-foreground">Bot actif depuis 12h</p>
                </div>
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Numéro WhatsApp</span>
                  <span className="font-mono">+229 xx xx xx xx</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dernière activité</span>
                  <span>Il y a 2 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Messages traités</span>
                  <span className="font-bold">3,429</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques du bot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Messages envoyés</span>
                  <span className="font-bold">2,891</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Messages reçus</span>
                  <span className="font-bold">538</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Conversations actives</span>
                  <span className="font-bold">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Taux de réponse</span>
                  <span className="font-bold text-success">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Voir les logs du bot
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Tester la connexion
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                Déconnecter le bot
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
