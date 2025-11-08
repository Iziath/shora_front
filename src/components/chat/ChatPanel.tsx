import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, X, Shield, RefreshCw, Sparkles, User, AlertTriangle } from 'lucide-react';
import axios from 'axios';
// Import du logo SHORA - utiliser le chemin relatif ou public
const logoShora = '/logo-shora.svg'; // Logo depuis le dossier public

interface ChatMessage {
    id: string;
    text_user?: string;
    text_bot?: string;
    type?: 'text' | 'button' | 'quiz' | 'incident' | 'reminder';
    buttons?: Array<{ label: string; value: string; emoji?: string }>;
    isLoading?: boolean;
    timestamp?: Date;
    imageUrl?: string; // Pour les rappels avec images
}

interface UserProfile {
    name?: string;
    mode?: 'text' | 'audio';
    profession?: string;
    chantierType?: string;
    langue?: string;
    completed?: boolean;
    userId?: string;
    isNewUser?: boolean;
}

type ConversationState = 'welcome' | 'name_question' | 'mode_selection' | 'profile_setup' | 'profile_question_1' | 'profile_question_2' | 'profile_question_3' | 'active' | 'incident' | 'ending';

interface ChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
    theme: 'light' | 'dark';
}

const ChatPanel = ({ isOpen, onClose, theme }: ChatPanelProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [conversationState, setConversationState] = useState<ConversationState>('welcome');
    const [userProfile, setUserProfile] = useState<UserProfile>({});
    const [points, setPoints] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasShownWelcome = useRef(false);
    const hasShownDailyTip = useRef(false);

    // Auto-scroll vers le bas lorsque de nouveaux messages arrivent
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Envoyer le message de fin quand le chat se ferme (si conversation active)
    useEffect(() => {
        if (!isOpen && conversationState === 'active' && userProfile.name) {
            // Le chat se ferme, mais on ne peut pas envoyer de message ici
            // Le message sera envoyé lors de la prochaine ouverture ou via handleResetChat
        }
    }, [isOpen, conversationState, userProfile.name]);

    // Message d'accueil automatique au premier chargement
    useEffect(() => {
        if (isOpen && !hasShownWelcome.current && messages.length === 0) {
            hasShownWelcome.current = true;
            setTimeout(() => {
                showWelcomeMessage();
            }, 500);
        }
    }, [isOpen]);

    // Fonction pour vérifier les rappels en attente
    const checkPendingReminders = async () => {
        if (!userProfile.name) return;
        
        try {
            let QURAN_API_URL = import.meta.env.VITE_QURAN_API_URL;
            if (!QURAN_API_URL) {
                const hostname = window.location.hostname;
                QURAN_API_URL = `http://${hostname}:3001`;
            }
            
            const response = await axios.get(`${QURAN_API_URL}/reminders/user/${encodeURIComponent(userProfile.name)}`);
            
            if (response.data.success && response.data.data.length > 0) {
                // Afficher le premier rappel en attente
                const reminder = response.data.data[0];
                
                const reminderMsg: ChatMessage = {
                    id: 'reminder-' + reminder._id,
                    text_bot: reminder.message,
                    type: 'reminder',
                    imageUrl: reminder.imageUrl,
                    timestamp: new Date(reminder.createdAt)
                };
                
                setMessages(prev => {
                    // Vérifier si ce rappel n'a pas déjà été affiché
                    const alreadyShown = prev.some(msg => msg.id === reminderMsg.id);
                    if (alreadyShown) return prev;
                    return [...prev, reminderMsg];
                });
                
                // Marquer le rappel comme envoyé
                try {
                    await axios.post(`${QURAN_API_URL}/reminders/${reminder._id}/mark-sent`);
                } catch (error) {
                    console.error('Erreur marquage rappel:', error);
                }
            }
        } catch (error) {
            console.error('Erreur vérification rappels:', error);
        }
    };

    // Vérifier les rappels en attente pour l'utilisateur
    useEffect(() => {
        if (conversationState === 'active' && userProfile.name) {
            // Vérifier immédiatement
            checkPendingReminders();
            
            // Vérifier toutes les 30 secondes pour de nouveaux rappels
            const reminderInterval = setInterval(() => {
                checkPendingReminders();
            }, 30000); // Toutes les 30 secondes
            
            return () => clearInterval(reminderInterval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationState, userProfile.name]);

    // Routine quotidienne - alerte du matin
    useEffect(() => {
        if (conversationState === 'active' && !hasShownDailyTip.current) {
            const now = new Date();
            const lastTipDate = localStorage.getItem('shora_last_tip_date');
            const today = now.toDateString();
            
            if (lastTipDate !== today) {
                hasShownDailyTip.current = true;
                localStorage.setItem('shora_last_tip_date', today);
                
                setTimeout(() => {
                    showDailyTip();
                }, 2000);
            }
        }
    }, [conversationState]);

    const showWelcomeMessage = () => {
        const welcomeMsg: ChatMessage = {
            id: 'welcome-' + Date.now(),
            text_bot: 'Salut 👋 Je suis Shora, ton compagnon sécurité sur le chantier.\n\nPour commencer, quel est ton nom ?',
            type: 'text',
            timestamp: new Date()
        };
        setMessages([welcomeMsg]);
        setConversationState('name_question');
    };

    const showDailyTip = () => {
        const tips = [
            '⚠️ Avant de soulever, vérifie que le sol n\'est pas glissant.',
            '🦺 N\'oublie pas ton casque ! C\'est ton meilleur ami sur le chantier.',
            '👷 Porte toujours tes gants de protection lors de la manipulation d\'outils.',
            '👀 Vérifie ton environnement avant de commencer le travail.',
            '🔌 Évite les fils électriques dénudés et signale-les immédiatement.'
        ];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        
        const tipMsg: ChatMessage = {
            id: 'daily-tip-' + Date.now(),
            text_bot: randomTip,
            type: 'text',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, tipMsg]);
    };

    const handleButtonClick = async (value: string, messageId: string) => {
        if (conversationState === 'mode_selection') {
            const mode = value as 'text' | 'audio';
            setUserProfile(prev => ({ ...prev, mode }));
            
            // Ajouter le choix de l'utilisateur
            const userChoice: ChatMessage = {
                id: 'user-choice-' + Date.now(),
                text_user: value === 'text' ? '🔤 Texte' : '🎧 Audio',
                timestamp: new Date()
            };
            
            // Message de confirmation
            const confirmMsg: ChatMessage = {
                id: 'confirm-' + Date.now(),
                text_bot: `Parfait ! Mode ${mode === 'text' ? 'texte' : 'audio'} activé. 🎯\n\nMaintenant, créons ton profil rapide pour personnaliser ton expérience.`,
                type: 'text',
                timestamp: new Date()
            };
            
            // Première question du profil
            setTimeout(() => {
                const question1: ChatMessage = {
                    id: 'question-1-' + Date.now(),
                    text_bot: 'Quel est ton métier ?',
                    type: 'text',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, userChoice, confirmMsg, question1]);
                setConversationState('profile_question_1');
            }, 1000);
        } else if (conversationState === 'profile_question_3') {
            // Gérer le choix de langue via bouton
            const langueMap: { [key: string]: string } = {
                'fr': 'Français',
                'ar': 'Arabe',
                'en': 'Anglais'
            };
            const langueLabel = langueMap[value] || value;
            
            setUserProfile(prev => ({ ...prev, langue: value, completed: true }));
            
            // Ajouter le choix de l'utilisateur
            const userChoice: ChatMessage = {
                id: 'user-langue-' + Date.now(),
                text_user: langueLabel,
                timestamp: new Date()
            };
            
            const completionMsg: ChatMessage = {
                id: 'completion-' + Date.now(),
                text_bot: `Excellent ! Profil créé. 🎉\n\nMétier: ${userProfile.profession}\nChantier: ${userProfile.chantierType}\nLangue: ${langueLabel}\n\nJe suis maintenant prêt à t'aider avec la sécurité sur ton chantier !`,
                type: 'text',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, userChoice, completionMsg]);
            setConversationState('active');
            
            // Proposer un quiz après le profil
            setTimeout(() => {
                showQuiz();
            }, 2000);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            id: 'user-' + Date.now(),
            text_user: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input.trim();
        const currentInputLower = currentInput.toLowerCase();
        setInput('');

        // Gestion du nom (première question)
        if (conversationState === 'name_question') {
            const userName = currentInput.trim();
            setUserProfile(prev => ({ ...prev, name: userName }));
            
            // Enregistrer ou mettre à jour l'utilisateur dans la base
            try {
                let QURAN_API_URL = import.meta.env.VITE_QURAN_API_URL;
                if (!QURAN_API_URL) {
                    const hostname = window.location.hostname;
                    QURAN_API_URL = `http://${hostname}:3001`;
                }
                
                const userResponse = await axios.post(`${QURAN_API_URL}/chatbot-users/create-or-update`, {
                    name: userName
                });
                
                if (userResponse.data.success) {
                    setUserProfile(prev => ({ 
                        ...prev, 
                        userId: userResponse.data.data._id,
                        isNewUser: userResponse.data.isNewUser
                    }));
                    
                    const greetingMsg: ChatMessage = {
                        id: 'greeting-' + Date.now(),
                        text_bot: userResponse.data.isNewUser 
                            ? `Enchanté ${userName} ! 👋 Bienvenue sur SHORA.\n\nTu veux qu'on parle en texte ou en audio ?`
                            : `Bon retour ${userName} ! 👋\n\nTu veux qu'on parle en texte ou en audio ?`,
                        type: 'button',
                        buttons: [
                            { label: 'Texte', value: 'text', emoji: '🔤' },
                            { label: 'Audio', value: 'audio', emoji: '🎧' }
                        ],
                        timestamp: new Date()
                    };
                    setMessages(prev => [...prev, greetingMsg]);
                    setConversationState('mode_selection');
                }
            } catch (error) {
                console.error('Erreur enregistrement utilisateur:', error);
                // Continuer même si l'enregistrement échoue
                const greetingMsg: ChatMessage = {
                    id: 'greeting-' + Date.now(),
                    text_bot: `Enchanté ${userName} ! 👋\n\nTu veux qu'on parle en texte ou en audio ?`,
                    type: 'button',
                    buttons: [
                        { label: 'Texte', value: 'text', emoji: '🔤' },
                        { label: 'Audio', value: 'audio', emoji: '🎧' }
                    ],
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, greetingMsg]);
                setConversationState('mode_selection');
            }
            return;
        }

        // Détection d'incident
        if (currentInputLower.includes('danger') || currentInputLower.includes('incident') || currentInputLower.includes('accident')) {
            handleIncident(currentInput);
            return;
        }

        // Gestion du profil
        if (conversationState === 'profile_question_1') {
            setUserProfile(prev => ({ ...prev, profession: currentInput }));
            const question2: ChatMessage = {
                id: 'question-2-' + Date.now(),
                text_bot: 'Quel type de chantier tu fais le plus souvent ?',
                type: 'text',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, question2]);
            setConversationState('profile_question_2');
            return;
        }

        if (conversationState === 'profile_question_2') {
            setUserProfile(prev => ({ ...prev, chantierType: currentInput }));
            const question3: ChatMessage = {
                id: 'question-3-' + Date.now(),
                text_bot: 'Dans quelle langue tu veux que je te parle ?',
                type: 'button',
                buttons: [
                    { label: 'Français', value: 'fr', emoji: '🇫🇷' },
                    { label: 'Arabe', value: 'ar', emoji: '🇲🇦' },
                    { label: 'Anglais', value: 'en', emoji: '🇬🇧' }
                ],
                timestamp: new Date()
            };
            setMessages(prev => [...prev, question3]);
            setConversationState('profile_question_3');
            return;
        }

        if (conversationState === 'profile_question_3') {
            setUserProfile(prev => ({ ...prev, langue: currentInput, completed: true }));
            
            // Mettre à jour l'utilisateur dans la base avec le profil complet
            try {
                let QURAN_API_URL = import.meta.env.VITE_QURAN_API_URL;
                if (!QURAN_API_URL) {
                    const hostname = window.location.hostname;
                    QURAN_API_URL = `http://${hostname}:3001`;
                }
                
                await axios.post(`${QURAN_API_URL}/chatbot-users/create-or-update`, {
                    name: userProfile.name,
                    profession: userProfile.profession,
                    chantierType: userProfile.chantierType,
                    langue: currentInput,
                    mode: userProfile.mode
                });
            } catch (error) {
                console.error('Erreur mise à jour profil:', error);
            }
            
            const completionMsg: ChatMessage = {
                id: 'completion-' + Date.now(),
                text_bot: `Excellent ! Profil créé. 🎉\n\nMétier: ${userProfile.profession}\nChantier: ${userProfile.chantierType}\nLangue: ${currentInput}\n\nJe suis maintenant prêt à t'aider avec la sécurité sur ton chantier !`,
                type: 'text',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, completionMsg]);
            setConversationState('active');
            
            // Proposer un quiz après le profil
            setTimeout(() => {
                showQuiz();
            }, 2000);
            return;
        }

        // Mode conversation active - envoyer au backend
        const loadingMsg: ChatMessage = {
            id: 'loading-' + Date.now(),
            text_bot: '',
            isLoading: true,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, loadingMsg]);

        try {
            let QURAN_API_URL = import.meta.env.VITE_QURAN_API_URL;
            
            if (!QURAN_API_URL) {
                const hostname = window.location.hostname;
                QURAN_API_URL = `http://${hostname}:3001`;
            }
            
            const response = await axios.post(`${QURAN_API_URL}/bot/voice-bot`, { 
                text: currentInput,
                profile: userProfile,
                state: conversationState
            });
            
            const botReply = response.data.text_bot || 'Désolé, aucune réponse.';
            
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === loadingMsg.id
                        ? { ...msg, text_bot: botReply, isLoading: false }
                        : msg
                )
            );

            // Détecter si la réponse contient un quiz
            if (botReply.includes('?') && (botReply.includes('1️⃣') || botReply.includes('2️⃣'))) {
                // C'est probablement un quiz
                setTimeout(() => {
                    showQuiz();
                }, 1000);
            }

            // Détecter la fin de conversation (au revoir, merci, etc.)
            const endingKeywords = ['au revoir', 'aurevoir', 'merci', 'bye', 'à bientôt', 'a bientot', 'fin', 'terminé', 'terminer'];
            if (endingKeywords.some(keyword => currentInputLower.includes(keyword))) {
                setTimeout(() => {
                    showEndingReminder();
                }, 2000);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message :', error);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === loadingMsg.id
                        ? { ...msg, text_bot: 'Désolé, une erreur est survenue. Réessaye plus tard.', isLoading: false }
                        : msg
                )
            );
        }
    };

    const handleIncident = async (description: string) => {
        const incidentMsg: ChatMessage = {
            id: 'incident-' + Date.now(),
            text_bot: '🚨 Incident détecté ! Je vais alerter le superviseur immédiatement.',
            type: 'incident',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, incidentMsg]);

        try {
            // Envoyer l'incident au backend principal avec les infos de l'utilisateur chatbot
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            await axios.post(`${API_URL}/api/incidents`, {
                description,
                type: 'danger', // 'danger', 'accident', 'near-miss', 'equipment'
                severity: 'high',
                reportedBy: 'chatbot',
                location: 'Chantier',
                chatbotUserId: userProfile.userId || null,
                chatbotUserName: userProfile.name || null
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const confirmMsg: ChatMessage = {
                id: 'incident-confirm-' + Date.now(),
                text_bot: '✅ Incident enregistré et signalé au superviseur. Un responsable va intervenir rapidement. Reste en sécurité !',
                type: 'text',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, confirmMsg]);
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de l\'incident:', error);
            const errorMsg: ChatMessage = {
                id: 'incident-error-' + Date.now(),
                text_bot: '⚠️ L\'incident a été noté. Contacte directement ton superviseur si c\'est urgent !',
                type: 'text',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    };

    const showQuiz = () => {
        const quizzes = [
            {
                question: 'Si tu vois un fil dénudé, tu fais quoi ?',
                options: [
                    { label: 'Je touche pour voir', value: 'wrong', emoji: '1️⃣' },
                    { label: 'Je signale', value: 'correct', emoji: '2️⃣' }
                ]
            },
            {
                question: 'Avant de monter sur une échelle, tu vérifies quoi ?',
                options: [
                    { label: 'Que l\'échelle est stable', value: 'correct', emoji: '1️⃣' },
                    { label: 'Rien, je monte directement', value: 'wrong', emoji: '2️⃣' }
                ]
            },
            {
                question: 'En cas de blessure, tu fais quoi en premier ?',
                options: [
                    { label: 'Je continue le travail', value: 'wrong', emoji: '1️⃣' },
                    { label: 'Je signale et je me soigne', value: 'correct', emoji: '2️⃣' }
                ]
            }
        ];

        const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
        const quizMsg: ChatMessage = {
            id: 'quiz-' + Date.now(),
            text_bot: randomQuiz.question,
            type: 'quiz',
            buttons: randomQuiz.options.map(opt => ({
                label: `${opt.emoji} ${opt.label}`,
                value: opt.value
            })),
            timestamp: new Date()
        };
        setMessages(prev => [...prev, quizMsg]);
    };

    const handleQuizAnswer = (value: string, messageId: string) => {
        if (value === 'correct') {
            const newPoints = points + 10;
            setPoints(newPoints);
            const response: ChatMessage = {
                id: 'quiz-response-' + Date.now(),
                text_bot: `Bien joué ! Tu viens d'éviter un risque 💪\n\n+10 points ! Total: ${newPoints} points 🏆`,
                type: 'text',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, response]);
        } else {
            const response: ChatMessage = {
                id: 'quiz-response-' + Date.now(),
                text_bot: `Attention ! La bonne réponse était l'autre option. Reste vigilant ! ⚠️`,
                type: 'text',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, response]);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const showEndingReminder = () => {
        const reminderMsg: ChatMessage = {
            id: 'ending-reminder-' + Date.now(),
            text_bot: `🛡️ **Rappel important avant de partir :**\n\n**Comment signaler un incident :**\n\n1️⃣ **Dans le chat** : Dis simplement "Danger" ou "Incident" et décris la situation\n2️⃣ **Appelle les secours** en cas d'urgence :\n   • 🚨 Pompiers : 19\n   • 🏥 SAMU : 15\n   • 🚔 Police : 17\n3️⃣ **Alerte ton superviseur** directement\n4️⃣ **Ne prends jamais de risques** inutiles\n\n💪 Reste vigilant et prends soin de toi !\n\nÀ bientôt ${userProfile.name || ''} ! 👋`,
            type: 'text',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, reminderMsg]);
        setConversationState('ending');
    };

    const handleMicClick = () => {
        if (userProfile.mode === 'audio') {
            // TODO: Implémenter Web Speech API
            alert('Fonctionnalité audio en cours de développement.');
        } else {
            alert('Active le mode audio dans tes préférences pour utiliser le microphone.');
        }
    };

    const handleResetChat = () => {
        // Afficher le rappel avant de réinitialiser si on est en conversation active
        if (conversationState === 'active' && userProfile.name) {
            showEndingReminder();
            setTimeout(() => {
                setMessages([]);
                setConversationState('welcome');
                setUserProfile({});
                setPoints(0);
                hasShownWelcome.current = false;
                hasShownDailyTip.current = false;
                setTimeout(() => {
                    showWelcomeMessage();
                }, 500);
            }, 3000);
        } else {
            setMessages([]);
            setConversationState('welcome');
            setUserProfile({});
            setPoints(0);
            hasShownWelcome.current = false;
            hasShownDailyTip.current = false;
            setTimeout(() => {
                showWelcomeMessage();
            }, 500);
        }
    };

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 transition-all duration-500"
                    onClick={onClose}
                />
            )}
            
            <div
                className={`
                    fixed top-0 right-0 h-full w-full sm:w-[550px] z-50
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                    ${theme === 'dark' 
                        ? 'bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95' 
                        : 'bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95'
                    }
                    shadow-2xl transition-all duration-700 ease-out
                    flex flex-col backdrop-blur-2xl border-l
                    ${theme === 'dark' ? 'border-gray-700/30' : 'border-gray-200/30'}
                    sm:rounded-l-3xl overflow-hidden
                `}
                style={{
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    opacity: isOpen ? 1 : 0
                }}
            >
                {/* En-tête SHORA avec logo */}
                <div className={`
                    relative p-6 
                    bg-gradient-to-r from-orange-500 via-orange-600 to-red-600
                    backdrop-blur-xl border-b border-white/10
                    shadow-xl
                `}>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                        transform rotate-45 animate-wave" />
                    </div>
                    
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center
                                               border border-white/30 shadow-2xl transform hover:scale-110 transition-all duration-500">
                                    <img src={logoShora} alt="SHORA" className="w-10 h-10 object-contain" />
                                </div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-orange-400/40 via-red-400/40 to-orange-500/40 
                                               rounded-2xl blur-md animate-pulse-slow" />
                            </div>
                            
                            <div className="text-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-2xl font-bold tracking-tight">SHORA</h2>
                                    <Sparkles className="h-5 w-5 text-yellow-300 animate-bounce" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <div className="w-4 h-4 bg-emerald-400 rounded-full shadow-lg animate-pulse" />
                                        <div className="absolute inset-0 w-4 h-4 bg-emerald-300 rounded-full animate-ping" />
                                    </div>
                                    <span className="text-sm text-white/90 font-medium">En ligne • Compagnon sécurité</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {points > 0 && (
                                <div className="px-3 py-1.5 bg-white/20 rounded-lg backdrop-blur-sm border border-white/30">
                                    <span className="text-sm font-bold text-white">🏆 {points}</span>
                                </div>
                            )}
                            <button
                                onClick={handleResetChat}
                                className="group relative p-3 hover:bg-white/20 rounded-2xl transition-all duration-500 
                                          backdrop-blur-lg border border-white/20 hover:border-white/30
                                          transform hover:scale-110 hover:-rotate-12"
                            >
                                <RefreshCw className="h-5 w-5 text-white/90 group-hover:text-white 
                                                    transition-all duration-500 group-hover:rotate-180" />
                            </button>
                            <button
                                onClick={onClose}
                                className="group relative p-3 hover:bg-white/20 rounded-2xl transition-all duration-500 
                                          backdrop-blur-lg border border-white/20 hover:border-white/30
                                          transform hover:scale-110 hover:rotate-12"
                            >
                                <X className="h-5 w-5 text-white/90 group-hover:text-white transition-colors duration-300" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Zone de messages */}
                <div className={`
                    flex-1 overflow-y-auto p-6 space-y-6
                    ${theme === 'dark' ? 'bg-gray-900/40' : 'bg-gray-50/40'}
                    custom-scrollbar
                `}>
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-fade-in">
                            <div className={`
                                w-24 h-24 rounded-full flex items-center justify-center mb-6 relative
                                bg-gradient-to-br from-orange-500/20 to-red-500/20
                                border ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300/50'}
                                animate-float shadow-2xl backdrop-blur-sm
                            `}>
                                <Shield className={`h-12 w-12 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                Bienvenue sur SHORA
                            </h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Ton compagnon sécurité sur le chantier
                            </p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div key={msg.id} className="space-y-4 animate-slide-in" style={{animationDelay: `${index * 0.1}s`}}>
                            {/* Message utilisateur */}
                            {msg.text_user && (
                                <div className="flex justify-end items-center gap-3">
                                    <div className={`
                                        max-w-xs lg:max-w-sm rounded-2xl rounded-tr-lg p-4 shadow-xl
                                        bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white
                                        transform hover:scale-[1.02]
                                        relative overflow-hidden border border-white/20 backdrop-blur-sm
                                    `}>
                                        <div className="relative z-10 text-sm font-medium leading-relaxed">
                                            {msg.text_user}
                                        </div>
                                    </div>
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                        bg-gradient-to-br from-orange-500 to-red-600
                                        shadow-xl border-2 border-white/30 transform hover:scale-110 transition-all duration-300
                                        animate-float
                                    `}>
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                            )}

                            {/* Message du bot */}
                            {msg.text_bot && (
                                <div className="flex justify-start items-center gap-3">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                        ${theme === 'dark' 
                                            ? 'bg-gradient-to-br from-gray-600 to-gray-700' 
                                            : 'bg-gradient-to-br from-gray-500 to-gray-600'
                                        }
                                        shadow-xl border-2 border-white/30 transform hover:scale-110 transition-all duration-300
                                        animate-float
                                    `}>
                                        <Shield className="h-5 w-5 text-white" />
                                    </div>
                                    <div className={`
                                        max-w-xs lg:max-w-sm rounded-2xl rounded-tl-lg p-4 shadow-xl
                                        ${theme === 'dark' 
                                            ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 text-gray-100 border border-gray-600/30' 
                                            : 'bg-gradient-to-br from-white/90 to-gray-50/90 text-gray-800 border border-gray-200/30'
                                        }
                                        backdrop-blur-lg
                                    `}>
                                        {msg.isLoading ? (
                                            <div className="flex items-center gap-3 py-3">
                                                <div className="thinking-dots">
                                                    <div className="dot"></div>
                                                    <div className="dot"></div>
                                                    <div className="dot"></div>
                                                </div>
                                                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    Shora réfléchit...
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {/* Image du rappel si disponible */}
                                                {msg.type === 'reminder' && msg.imageUrl && (
                                                    <div className="w-full rounded-lg overflow-hidden mb-2">
                                                        <img 
                                                            src={msg.imageUrl} 
                                                            alt="Rappel sécurité" 
                                                            className="w-full h-48 object-cover"
                                                            onError={(e) => {
                                                                // Si l'image ne charge pas, cacher l'élément
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="text-sm font-medium leading-relaxed whitespace-pre-line">
                                                    {msg.text_bot}
                                                </div>
                                                {/* Badge rappel */}
                                                {msg.type === 'reminder' && (
                                                    <div className="flex items-center gap-1 mt-2">
                                                        <div className="px-2 py-1 bg-orange-500/20 border border-orange-500/50 rounded-lg">
                                                            <span className="text-xs font-medium text-orange-600 dark:text-orange-400">📢 Rappel sécurité</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Boutons (mode, quiz, etc.) */}
                            {msg.buttons && msg.buttons.length > 0 && (
                                <div className="flex flex-wrap gap-2 ml-14">
                                    {msg.buttons.map((btn, btnIndex) => (
                                        <button
                                            key={btnIndex}
                                            onClick={() => {
                                                if (msg.type === 'quiz') {
                                                    handleQuizAnswer(btn.value, msg.id);
                                                } else {
                                                    handleButtonClick(btn.value, msg.id);
                                                }
                                            }}
                                            className={`
                                                px-4 py-2 rounded-xl shadow-lg transition-all duration-300
                                                transform hover:scale-105 active:scale-95
                                                ${theme === 'dark'
                                                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border border-orange-400/30'
                                                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white border border-orange-400/30'
                                                }
                                                hover:shadow-xl
                                            `}
                                        >
                                            <span className="text-sm font-medium">{btn.emoji} {btn.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Badge incident */}
                            {msg.type === 'incident' && (
                                <div className="ml-14 flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                    <span className="text-xs font-medium text-red-600 dark:text-red-400">Incident signalé</span>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Zone d'input */}
                <div className={`
                    p-6 border-t backdrop-blur-2xl
                    ${theme === 'dark' 
                        ? 'bg-gray-800/90 border-gray-700/30' 
                        : 'bg-white/90 border-gray-200/30'
                    }
                `}>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={conversationState === 'active' ? "Tapez votre message..." : "Répondez à la question..."}
                                className={`
                                    w-full p-4 rounded-2xl border-2 resize-none min-h-[3rem] max-h-32
                                    ${theme === 'dark' 
                                        ? 'bg-gray-700/80 border-gray-600/50 text-white placeholder-gray-400' 
                                        : 'bg-white/80 border-gray-300/50 text-gray-800 placeholder-gray-500'
                                    }
                                    focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20
                                    backdrop-blur-sm transition-all duration-500 shadow-xl
                                    hover:border-orange-400 hover:shadow-2xl transform hover:scale-[1.02]
                                `}
                                style={{ lineHeight: '1.5' }}
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className={`
                                    group relative p-3 rounded-2xl shadow-xl transition-all duration-500 transform 
                                    ${input.trim() 
                                        ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-600 hover:via-orange-700 hover:to-red-700 hover:scale-110 hover:rotate-6 text-white border border-white/20' 
                                        : 'bg-gray-300/50 text-gray-400 cursor-not-allowed border border-gray-300/30'
                                    }
                                    hover:shadow-2xl disabled:hover:scale-100 disabled:hover:rotate-0
                                    backdrop-blur-sm
                                `}
                            >
                                <Send className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                            
                            <button
                                onClick={handleMicClick}
                                className={`
                                    group relative p-3 rounded-2xl shadow-xl
                                    hover:shadow-2xl transform hover:scale-110 hover:-rotate-6 transition-all duration-500
                                    border border-white/20 backdrop-blur-sm
                                    ${userProfile.mode === 'audio'
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                                        : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white opacity-60'
                                    }
                                `}
                            >
                                <Mic className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Styles CSS */}
            <style>{`
                @keyframes wave {
                    0%, 100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                    50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-10px) rotate(2deg); }
                    50% { transform: translateY(-5px) rotate(0deg); }
                    75% { transform: translateY(-15px) rotate(-2deg); }
                }
                
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                }
                
                .animate-wave { animation: wave 4s ease-in-out infinite; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-slide-in { animation: slide-in 0.8s ease-out forwards; }
                .animate-fade-in { animation: fade-in 1s ease-out; }
                .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
                
                .thinking-dots {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }
                
                .thinking-dots .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #f97316, #ef4444);
                    animation: thinking 1.8s ease-in-out infinite;
                    box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
                }
                
                .thinking-dots .dot:nth-child(1) { animation-delay: 0s; }
                .thinking-dots .dot:nth-child(2) { animation-delay: 0.3s; }
                .thinking-dots .dot:nth-child(3) { animation-delay: 0.6s; }
                
                @keyframes thinking {
                    0%, 60%, 100% {
                        transform: translateY(0) scale(1);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-20px) scale(1.3);
                        opacity: 1;
                        box-shadow: 0 4px 16px rgba(249, 115, 22, 0.6);
                    }
                }
                
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(249, 115, 22, 0.5) transparent;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, rgba(249, 115, 22, 0.5), rgba(239, 68, 68, 0.5));
                    border-radius: 10px;
                    transition: all 0.3s ease;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(239, 68, 68, 0.8));
                }
            `}</style>
        </>
    );
};

export default ChatPanel;
