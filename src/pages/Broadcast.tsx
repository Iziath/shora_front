import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Radio, Send, Clock, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Broadcast = () => {
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Radio className="h-8 w-8 text-primary" />
          Diffusion de messages
        </h1>
        <p className="text-muted-foreground mt-1">
          Envoyer des messages groupés aux utilisateurs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Composer un message</CardTitle>
              <CardDescription>
                Rédigez votre message de diffusion en français, fon ou yoruba
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Langue du message</Label>
                <Select defaultValue="fr">
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="fon">Fon</SelectItem>
                    <SelectItem value="yor">Yoruba</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  placeholder="Ex: Rappel de sécurité"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Rédigez votre message ici..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {message.length} / 1000 caractères
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="flex-1 gap-2">
                  <Send className="h-4 w-4" />
                  Envoyer maintenant
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Clock className="h-4 w-4" />
                  Programmer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Destinataires
              </CardTitle>
              <CardDescription>
                Sélectionnez les groupes de destinataires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="all" />
                  <label
                    htmlFor="all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Tous les utilisateurs (1,247)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="workers" />
                  <label
                    htmlFor="workers"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Ouvriers uniquement (1,089)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="supervisors" />
                  <label
                    htmlFor="supervisors"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Superviseurs (142)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="active" />
                  <label
                    htmlFor="active"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Actifs cette semaine (876)
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Total sélectionné</p>
                <p className="text-3xl font-bold text-primary">0</p>
                <p className="text-xs text-muted-foreground mt-1">
                  utilisateurs recevront ce message
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Messages récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">Rappel EPI</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures • 1,247 destinataires</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">Formation sécurité</p>
                  <p className="text-xs text-muted-foreground">Hier • 142 destinataires</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
