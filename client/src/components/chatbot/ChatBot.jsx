import React, { useState, useEffect, useRef } from 'react';
import { ImMagicWand } from "react-icons/im";
import { FaUser, FaTimes, FaPaperPlane, FaLock } from 'react-icons/fa';
import { FaRegCopy } from "react-icons/fa6";

const ChatBot = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showTooltip, setShowTooltip] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [showNotification, setShowNotification] = useState(true);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Hide the notification after 2-3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNotification(false);
        }, 3000); // 3 seconds

        return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }, []);

    const sendMessage = async () => {
        if (message.trim() && !isSending) {
            setIsSending(true);
            setChatHistory(prevHistory => [...prevHistory, { role: 'user', content: message }]);
            setMessage('');
            setIsTyping(true);

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: "Your custom system message prompt..."
                            },
                            {
                                role: 'user',
                                content: message,
                            },
                        ],
                    }),
                });

                const data = await response.json();
                setIsTyping(false);

                if (response.ok) {
                    setChatHistory(prevHistory => [...prevHistory,
                        { role: 'assistant', content: data.choices[0].message.content }
                    ]);
                } else {
                    console.error('API Error:', data.error);
                    alert(`API Error: ${data.error.message}`);
                }
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setIsSending(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [message]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory]);

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setShowTooltip(index);
        setTimeout(() => setShowTooltip(null), 2000);
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {showNotification && (
                <div className="fixed bottom-28 right-5 bg-blue-950 text-white p-3 rounded-lg shadow-lg max-w-xs text-center cursor-pointer animate-slideIn">
                    🤖 We're back and better than ever! <br/>Ready to help with all your AI needs.🔥
                </div>
            )}
            {!isOpen && (
                <div className="w-16 h-16 bg-blue-950 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform duration-200" onClick={() => setIsOpen(true)}>
                    <ImMagicWand size={28} color="white" />
                </div>
            )}
            {isOpen && (
                <div className="w-96 h-[558px] bg-gray-800 rounded-lg flex flex-col shadow-2xl overflow-hidden">
                    <div className="bg-gray-700 p-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <FaLock className="w-8 h-8 mr-2 text-white" />
                            <span className="text-lg font-bold text-white">AI GPT Support</span>
                        </div>
                        <FaTimes className="text-white text-xl cursor-pointer hover:text-gray-300 transition-colors duration-200" onClick={() => setIsOpen(false)} />
                    </div>
                    <div className="flex-grow flex flex-col bg-gray-800 overflow-hidden">
                        <div className="flex-grow p-2 overflow-y-auto bg-gray-800 border-b border-gray-600 flex flex-col scroll-smooth">
                            {chatHistory.length === 0 && (
                                <div className="text-center mt-24 text-gray-400">
                                    <FaLock className="w-20 h-20 mx-auto mb-5" />
                                    <p className="text-lg font-semibold">How can I help you today?</p>
                                </div>
                            )}
                            {chatHistory.map((entry, index) => (
                                <div key={index} className={`flex items-start mb-4 ${entry.role === 'user' ? 'justify-end' : ''}`}>
                                    {entry.role === 'user' ? (
                                        <FaUser className="w-8 h-8 text-white bg-transparent rounded-full mr-2" />
                                    ) : (
                                        <FaLock className="w-8 h-8 text-white bg-transparent rounded-full mr-2" />
                                    )}
                                    <div className={`bg-gray-700 text-white p-3 rounded-lg max-w-3/4 relative ${entry.role === 'user' ? 'bg-transparent' : ''}`}>
                                        <span>{entry.content}</span>
                                        {entry.role === 'assistant' && (
                                            <>
                                                <FaRegCopy
                                                    className="absolute bottom-[-25px] right-0 text-gray-400 text-lg cursor-pointer hover:text-white transition-colors duration-200"
                                                    onClick={() => handleCopy(entry.content, index)}
                                                />
                                                {showTooltip === index && (
                                                    <div className="absolute bottom-[-30px] right-0 bg-gray-700 text-white p-1 rounded-md text-xs shadow-lg">
                                                        Copied!
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-start mb-4">
                                    <FaLock className="w-8 h-8 text-white bg-transparent rounded-full mr-2" />
                                    <div className="bg-gray-700 p-2 rounded-lg">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-blink"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-blink delay-100"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-blink delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 bg-gray-700 border-t border-gray-600">
                            <div className="relative">
                                <textarea
                                    ref={textareaRef}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Message yourGPT"
                                    disabled={isSending}
                                    onKeyPress={handleKeyPress}
                                    className="w-full p-3 rounded-2xl bg-gray-800 text-white text-sm outline-none resize-none max-h-28 overflow-y-auto"
                                    rows={1}
                                />
                                <button onClick={sendMessage} disabled={isSending || !message.trim()} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl hover:text-white transition-colors duration-200">
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
