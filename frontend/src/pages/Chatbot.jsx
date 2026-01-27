import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! 🌱 I'm your Gardening Buddy powered by AI. Ask me anything about plants - watering schedules, sunlight needs, pest control, or growing tips!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Send message with conversation history for context
            const response = await api.post('/chat', {
                message: input,
                history: messages.slice(-10) // Send last 10 messages for context
            });

            const botMessage = {
                text: response.data.reply,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                text: "I'm having trouble connecting. Please try again in a moment! 🌿",
                sender: 'bot'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestedQuestions = [
        "How often should I water my succulents?",
        "Best indoor plants for low light?",
        "How to grow tomatoes from seeds?",
        "Why are my plant leaves turning yellow?"
    ];

    return (
        <div className="page-container">
            <div className="text-center mb-6">
                <h1 className="text-3xl text-white mb-2">🌿 Plant Assistant</h1>
                <p className="text-muted flex items-center justify-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    Powered by Gemini AI
                </p>
            </div>

            <motion.div
                className="glass-panel max-w-2xl mx-auto flex flex-col"
                style={{ height: 'calc(100vh - 240px)', minHeight: '400px' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className={`flex items-start gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user'
                                        ? 'bg-primary/20'
                                        : 'bg-violet-500/20'
                                    }`}>
                                    {msg.sender === 'user'
                                        ? <User size={16} className="text-primary" />
                                        : <Bot size={16} className="text-violet-400" />
                                    }
                                </div>
                                <div className={`p-3 rounded-2xl ${msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-tr-sm'
                                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
                                    }`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Loading indicator */}
                    {loading && (
                        <motion.div
                            className="flex justify-start"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="flex items-start gap-2">
                                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                                    <Bot size={16} className="text-violet-400" />
                                </div>
                                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-sm">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions (only show when no conversation yet) */}
                {messages.length === 1 && (
                    <div className="px-4 pb-2">
                        <p className="text-xs text-muted mb-2">Try asking:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(q)}
                                    className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="input-field flex-1"
                            placeholder="Ask about plant care..."
                            disabled={loading}
                        />
                        <button
                            onClick={handleSend}
                            className="btn-primary px-4"
                            disabled={loading || !input.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Chatbot;
