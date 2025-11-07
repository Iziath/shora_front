import { useState, useEffect, useRef } from 'react';
import { Send, Mic, X, Bot, User, RefreshCw, Shield } from 'lucide-react';
import { apiRequest } from '../../lib/api';

interface ChatMessage {
    id: string;
    text_user: string;
    text_bot?: string;
    isLoading?: boolean;
}

interface ShoraChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
    theme: 'light' | 'dark';
}

const ShoraChatPanel = ({ isOpen, onClose, theme }: ShoraChatPanelProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll vers le bas lorsque de nouveaux messages arrivent
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Gérer l'envoi du message
    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text_user: input,
            isLoading: true,
        };
        setMessages([...messages, userMessage]);
        setInput('');

        try {
            const response = await apiRequest('/api/bot/chat', {
                method: 'POST',
                body: JSON.stringify({ text: input }),
            });
            
            if (response.success && response.data) {
                const newMessage = response.data;
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === userMessage.id
                            ? { ...msg, text_bot: newMessage.text_bot || 'Désolé, aucune réponse.', isLoading: false }
                            : msg
                    )
                );
            } else {
                throw new Error(response.error || 'Erreur lors de la récupération de la réponse');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message :', error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === userMessage.id
                        ? { ...msg, text_bot: 'Désolé, une erreur est survenue. Veuillez réessayer.', isLoading: false }
                        : msg
                )
            );
        }
    };

    // Gérer l'appui sur Entrée
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Gérer la synthèse vocale (microphone - simulation)
    const handleMicClick = () => {
        alert('Fonctionnalité microphone à implémenter (Web Speech API).');
    };

    // Réinitialiser la discussion
    const handleResetChat = () => {
        setMessages([]);
    };

    return (
        <>
            {/* Overlay avec blur pour le fond */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 transition-all duration-500"
                    onClick={onClose}
                />
            )}
            
            {/* Panel principal */}
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
                {/* En-tête avec gradient et glassmorphism - Thème SHORA (sécurité) */}
                <div className={`
                    relative p-6 
                    ${theme === 'dark' 
                        ? 'bg-gradient-to-r from-orange-500/90 via-orange-600/90 to-red-600/90' 
                        : 'bg-gradient-to-r from-orange-400/90 via-orange-600/90 to-red-600/90'
                    }
                    backdrop-blur-xl border-b border-white/10
                    shadow-xl
                `}>
                    {/* Effet de vague animé */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                        transform rotate-45 animate-wave" />
                    </div>
                    
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Avatar avec animation fluide - SHORA */}
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-white/25 to-white/5 
                                               backdrop-blur-lg rounded-2xl flex items-center justify-center
                                               border border-white/20 shadow-2xl transform hover:scale-110 hover:rotate-6
                                               transition-all duration-500 ease-out animate-float">
                                    <Shield className="h-8 w-8 text-white drop-shadow-lg" />
                                </div>
                                {/* Double cercle d'animation */}
                                <div className="absolute -inset-2 bg-gradient-to-r from-orange-400/40 via-red-400/40 to-orange-500/40 
                                               rounded-2xl blur-md animate-pulse-slow" />
                                <div className="absolute -inset-3 bg-gradient-to-r from-white/20 to-transparent 
                                               rounded-2xl animate-spin-slow" />
                            </div>
                            
                            <div className="text-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text">
                                        SHORA Bot
                                    </h2>
                                    <Shield className="h-5 w-5 text-yellow-300 animate-bounce" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <div className="w-4 h-4 bg-emerald-700 rounded-full shadow-lg animate-pulse" />
                                        <div className="absolute inset-0 w-4 h-4 bg-emerald-300 rounded-full animate-ping" />
                                    </div>
                                    <span className="text-sm text-white/90 font-medium">En ligne • Assistant Sécurité</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Boutons d'action avec hover effects */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleResetChat}
                                className="group relative p-3 hover:bg-white/20 rounded-2xl transition-all duration-500 
                                          backdrop-blur-lg border border-white/10 hover:border-white/30
                                          transform hover:scale-110 hover:-rotate-12"
                            >
                                <RefreshCw className="h-5 w-5 text-white/90 group-hover:text-white 
                                                    transition-all duration-500 group-hover:rotate-180" />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400/20 to-red-400/20 
                                               opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                            <button
                                onClick={onClose}
                                className="group relative p-3 hover:bg-white/20 rounded-2xl transition-all duration-500 
                                          backdrop-blur-lg border border-white/10 hover:border-white/30
                                          transform hover:scale-110 hover:rotate-12"
                            >
                                <X className="h-5 w-5 text-white/90 group-hover:text-white transition-colors duration-300" />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-400/20 to-pink-400/20 
                                               opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Zone de messages avec scroll personnalisé */}
                <div className={`
                    flex-1 overflow-y-auto p-6 space-y-6
                    ${theme === 'dark' ? 'bg-gray-900/40' : 'bg-gray-50/40'}
                    custom-scrollbar
                `}>
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-fade-in">
                            <div className={`
                                w-24 h-24 rounded-full flex items-center justify-center mb-6 relative
                                ${theme === 'dark' 
                                    ? 'bg-gradient-to-br from-orange-600/20 to-red-600/20' 
                                    : 'bg-gradient-to-br from-orange-500/20 to-red-500/20'
                                }
                                border ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300/50'}
                                animate-float shadow-2xl backdrop-blur-sm
                            `}>
                                <Shield className={`h-12 w-12 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                                <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 to-red-400/20 
                                               rounded-full blur-xl animate-pulse-slow" />
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                Commencez une conversation
                            </h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Posez-moi vos questions sur la sécurité au travail, je suis là pour vous aider ! 🦺
                            </p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div key={msg.id} className="space-y-4 animate-slide-in" style={{animationDelay: `${index * 0.1}s`}}>
                            {/* Message utilisateur */}
                            <div className="flex justify-end items-center gap-3">
                                <div className={`
                                    max-w-xs lg:max-w-sm rounded-2xl rounded-tr-lg p-4 shadow-xl
                                    bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-white
                                    transform hover:scale-[1.02]
                                    relative overflow-hidden border border-white/20 backdrop-blur-sm
                                `}>
                                    <div className="relative z-10 text-sm font-medium leading-relaxed">
                                        {msg.text_user}
                                    </div>
                                    {/* Effet de brillance animé */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                                    transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                                                    transition-transform duration-1000" />
                                </div>
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                    ${theme === 'dark' 
                                        ? 'bg-gradient-to-br from-orange-600 to-red-700' 
                                        : 'bg-gradient-to-br from-orange-500 to-red-600'
                                    }
                                    shadow-xl border-2 border-white/30 transform hover:scale-110 transition-all duration-300
                                    animate-float
                                `}>
                                    <User className="h-5 w-5 text-white" />
                                </div>
                            </div>

                            {/* Message du bot ou loader */}
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
                                    transform 
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
                                                SHORA réfléchit...
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-sm font-medium leading-relaxed">
                                            {msg.text_bot}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Zone d'input avec style moderne */}
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
                                placeholder="Posez votre question sur la sécurité au travail..."
                                className={`
                                    w-full p-4 rounded-2xl border-2 resize-none min-h-[3rem] max-h-32
                                    ${theme === 'dark' 
                                        ? 'bg-gray-700/80 border-gray-600/50 text-white placeholder-gray-400' 
                                        : 'bg-white/80 border-gray-300/50 text-gray-800 placeholder-gray-500'
                                    }
                                    focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20
                                    backdrop-blur-sm transition-all duration-500 shadow-xl
                                    hover:border-orange-300 hover:shadow-2xl transform hover:scale-[1.02]
                                `}
                                style={{ lineHeight: '1.5' }}
                            />
                        </div>
                        
                        {/* Boutons d'action alignés */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className={`
                                    group relative p-3 rounded-2xl shadow-xl transition-all duration-500 transform 
                                    ${input.trim() 
                                        ? 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:via-red-600 hover:to-orange-700 hover:scale-110 hover:rotate-6 text-white border border-white/20' 
                                        : 'bg-gray-300/50 text-gray-400 cursor-not-allowed border border-gray-300/30'
                                    }
                                    hover:shadow-2xl disabled:hover:scale-100 disabled:hover:rotate-0
                                    backdrop-blur-sm
                                `}
                            >
                                <Send className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                                {input.trim() && (
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400/20 via-red-400/20 to-orange-500/20 
                                                   opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                )}
                            </button>
                            
                            <button
                                onClick={handleMicClick}
                                className="group relative p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 
                                          hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl
                                          hover:shadow-2xl transform hover:scale-110 hover:-rotate-6 transition-all duration-500
                                          border border-white/20 backdrop-blur-sm"
                            >
                                <Mic className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/20 to-teal-400/20 
                                               opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Styles CSS personnalisés ultra fluides */}
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
                
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .animate-wave { animation: wave 4s ease-in-out infinite; }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-slide-in { animation: slide-in 0.8s ease-out forwards; }
                .animate-fade-in { animation: fade-in 1s ease-out; }
                .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
                
                /* Animation des points de réflexion ultra fluide */
                .thinking-dots {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }
                
                .thinking-dots .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: ${theme === 'dark' ? 'linear-gradient(135deg, #f97316, #ef4444)' : 'linear-gradient(135deg, #ea580c, #f97316)'};
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
                    scrollbar-color: ${theme === 'dark' ? 'rgba(249, 115, 22, 0.5) transparent' : 'rgba(234, 88, 12, 0.5) transparent'};
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${theme === 'dark' ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.5), rgba(239, 68, 68, 0.5))' : 'linear-gradient(135deg, rgba(234, 88, 12, 0.5), rgba(249, 115, 22, 0.5))'};
                    border-radius: 10px;
                    transition: all 0.3s ease;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${theme === 'dark' ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(239, 68, 68, 0.8))' : 'linear-gradient(135deg, rgba(234, 88, 12, 0.8), rgba(249, 115, 22, 0.8))'};
                }
            `}</style>
        </>
    );
};

export default ShoraChatPanel;

