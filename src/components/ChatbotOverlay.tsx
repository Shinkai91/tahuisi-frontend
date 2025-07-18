import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatbotOverlayProps {
    onClose: () => void;
}

interface ChatMessage {
    role: "user" | "bot";
    content: string;
}

const ChatbotOverlay: React.FC<ChatbotOverlayProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: "bot", content: "Hello! I am your nutrition assistant. What would you like to know?" },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages: ChatMessage[] = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: input }),
            });

            if (!response.ok) {
                throw new Error("Failed to contact the chatbot");
            }

            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                { role: "bot", content: data.response || "Sorry, I didn't understand that." },
            ]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: "An error occurred. Please try again later." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isLoading) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-full max-w-md h-full bg-white dark:bg-gray-900 flex flex-col shadow-xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Nutrition Chatbot
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`rounded-xl px-4 py-2 max-w-xs md:max-w-sm text-sm break-words ${
                                        msg.role === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl px-4 py-2 text-sm">
                                    Typing...
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t dark:border-gray-700 flex items-center">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 border rounded-xl px-4 py-2 mr-2 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 focus:outline-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm"
                        >
                            Send
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatbotOverlay;