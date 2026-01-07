import React, { useState } from 'react';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Gardening Buddy. Ask me anything about plants!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // Simple mock response logic
        setTimeout(() => {
            let botText = "That's an interesting question about plants!";
            const lowerInput = input.toLowerCase();

            if (lowerInput.includes('water')) {
                botText = "Most plants need watering when the top inch of soil feels dry. Overwatering is a common mistake!";
            } else if (lowerInput.includes('sun') || lowerInput.includes('light')) {
                botText = "Light requirements vary. 'Full sun' means 6+ hours of direct light, while 'low light' suitable plants serve well indoors.";
            } else if (lowerInput.includes('fertilizer') || lowerInput.includes('feed')) {
                botText = "Feed your plants during the growing season (spring and summer). Avoid fertilizing in winter.";
            } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
                botText = "Hi there! Ready to grow something green?";
            }

            setMessages(prev => [...prev, { text: botText, sender: 'bot' }]);
        }, 1000);
    };

    return (
        <div className="page-container">
            <h1 className="text-3xl text-white mb-6">Plant Assistant</h1>
            <div className="glass-panel max-w-2xl mx-auto flex flex-col h-[500px]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-slate-700 text-gray-200'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-slate-700 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="input-field flex-1"
                        placeholder="Ask about watering, sunlight, etc..."
                    />
                    <button onClick={handleSend} className="btn-primary">Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
