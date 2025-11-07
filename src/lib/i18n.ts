// Internationalization support for Shora-Bot
// Languages: French (FR), Fon (FON), Yoruba (YOR)

export type Language = 'fr' | 'fon' | 'yor';

export const translations = {
  fr: {
    // Navigation
    dashboard: 'Tableau de bord',
    incidents: 'Incidents',
    users: 'Utilisateurs',
    broadcast: 'Diffusion',
    qrCode: 'Code QR',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    
    // Dashboard
    totalUsers: 'Utilisateurs totaux',
    activeIncidents: 'Incidents actifs',
    messagesThisMonth: 'Messages ce mois',
    engagementRate: 'Taux d\'engagement',
    
    // Incidents
    newIncident: 'Nouvel incident',
    incidentType: 'Type d\'incident',
    severity: 'Gravité',
    status: 'Statut',
    reportedBy: 'Signalé par',
    dateReported: 'Date de signalement',
    location: 'Lieu',
    description: 'Description',
    
    // Users
    addUser: 'Ajouter utilisateur',
    phoneNumber: 'Numéro de téléphone',
    role: 'Rôle',
    lastActive: 'Dernière activité',
    
    // Broadcast
    sendBroadcast: 'Envoyer une diffusion',
    selectRecipients: 'Sélectionner les destinataires',
    message: 'Message',
    sendNow: 'Envoyer maintenant',
    schedule: 'Programmer',
    
    // Common
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    loading: 'Chargement...',
    noData: 'Aucune donnée',
  },
  fon: {
    // Navigation (Fon placeholders - to be properly translated)
    dashboard: 'Atɛ gbɛzan',
    incidents: 'Aflɔmɛ lɛ',
    users: 'Nùzannɔ lɛ',
    broadcast: 'Xlɛ kaka',
    qrCode: 'QR kɔdji',
    settings: 'Jijɔ lɛ',
    logout: 'Do gbɔn',
    
    totalUsers: 'Nùzannɔ lɛ ɖé',
    activeIncidents: 'Aflɔmɛ ɖé ɔ wà wɛma',
    messagesThisMonth: 'Xlɛ lɛ xwè é',
    engagementRate: 'Kpé ɖagbe',
    
    newIncident: 'Aflɔmɛ yɔyɔ',
    save: 'Ɖó',
    cancel: 'Gbɔ',
    search: 'Ku',
  },
  yor: {
    // Navigation (Yoruba placeholders - to be properly translated)
    dashboard: 'Ojú pánẹ́ẹ̀lì',
    incidents: 'Àwọn ìṣẹ̀lẹ̀',
    users: 'Àwọn òǹlò',
    broadcast: 'Ìkéde gbogbò',
    qrCode: 'Kóòdù QR',
    settings: 'Ètò',
    logout: 'Jáde',
    
    totalUsers: 'Àpapọ̀ òǹlò',
    activeIncidents: 'Àwọn ìṣẹ̀lẹ̀ ṣíṣẹ́',
    messagesThisMonth: 'Àwọn ìfọ̀rọ̀wérọ̀ oṣù yìí',
    engagementRate: 'Ìpín ìlọ́wọ́sí',
    
    newIncident: 'Ìṣẹ̀lẹ̀ tuntun',
    save: 'Fipamọ́',
    cancel: 'Fagile',
    search: 'Wá',
  },
};

export const useTranslation = (lang: Language = 'fr') => {
  const t = (key: keyof typeof translations.fr): string => {
    return translations[lang][key] || translations.fr[key] || key;
  };

  return { t };
};
