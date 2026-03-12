"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Chatbot() {
    const pathname = usePathname();
    if (pathname?.startsWith("/admin")) return null;
    const [isOpen, setIsOpen] = useState(false);

    // Open chatbot after mount (avoids SSR/hydration mismatch)
    useEffect(() => {
        setIsOpen(true);
    }, []);
    const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
        { role: "bot", content: "Hi there! I'm the RutuFruits assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Generate session ID on mount
    useEffect(() => {
        setSessionId("sess_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    }, []);

    // Speech Recognition setup (Web Speech API)
    const recognitionRef = useRef<any>(null);
    const processUserMessageRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = "en-IN";

                recognition.onstart = () => {
                    setIsListening(true);
                };

                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    if (processUserMessageRef.current) {
                        processUserMessageRef.current(transcript);
                    }
                };

                recognition.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            }
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const toggleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };

    const processUserMessage = async (userMsg: string) => {
        if (!userMsg.trim()) return;

        // Add user message
        setMessages((prev) => [...prev, { role: "user", content: userMsg.trim() }]);

        try {
            const response = await fetch("https://synthomind.cloud/webhook/rutu-chatbot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    msg: userMsg.trim(),
                    sessionId: sessionId
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            setMessages((prev) => [...prev, { role: "bot", content: data.output || "Sorry, I didn't understand that." }]);
        } catch (error) {
            console.error("Error communicating with chatbot webhook:", error);
            setMessages((prev) => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting to the server. Please try again later." }]);
        }
    };

    processUserMessageRef.current = processUserMessage;

    const handleSend = () => {
        if (!input.trim()) return;
        processUserMessage(input);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <>
            {/* Chat Bubble Toggle button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-20 h-20 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
                    style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
                    aria-label="Toggle Chatbot"
                >
                    {isOpen ? (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <span className="text-4xl leading-none select-none" role="img" aria-label="mango">🥭</span>
                    )}
                </button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 w-80 sm:w-96 rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden"
                    style={{ height: "500px", maxHeight: "80vh", backgroundColor: "white", border: "1px solid rgba(44,74,46,0.1)" }}
                >
                    {/* Header */}
                    <div
                        className="px-4 py-3 flex items-center justify-between shadow-sm"
                        style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--mango)" }}>
                                <span className="text-sm font-bold" style={{ color: "var(--charcoal)" }}>RF</span>
                            </div>
                            <div>
                                <h3 className="text-base font-semibold" style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>RutuFruits Support</h3>
                                <p className="text-xs opacity-80">Usually replies instantly</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:opacity-70 transition-opacity">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.role === "user"
                                        ? "rounded-br-none"
                                        : "rounded-bl-none"
                                        }`}
                                    style={{
                                        backgroundColor: msg.role === "user" ? "var(--forest)" : "white",
                                        color: msg.role === "user" ? "var(--ivory)" : "var(--charcoal)",
                                        border: msg.role === "user" ? "none" : "1px solid rgba(0,0,0,0.05)",
                                        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif"
                                    }}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t flex items-center gap-2">
                        <button
                            onClick={toggleListen}
                            className={`p-2 rounded-full transition-colors ${isListening ? "animate-pulse" : "hover:bg-gray-100"}`}
                            style={{ color: isListening ? "red" : "var(--forest)" }}
                            title={isListening ? "Listening..." : "Click to speak"}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 text-sm rounded-full border focus:outline-none"
                            style={{ borderColor: "rgba(44,74,46,0.2)", color: "var(--charcoal)" }}
                        />

                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="p-2 rounded-full transition-colors disabled:opacity-50"
                            style={{ backgroundColor: "var(--forest)", color: "var(--ivory)" }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
