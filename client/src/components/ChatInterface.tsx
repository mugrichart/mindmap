"use client";

import { useState, useRef, useEffect } from "react";
import { User, ChevronDown, Check, CornerDownLeft, Menu } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const MODELS = [
    { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
    { id: "claude-3-5", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
    { id: "deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek" },
];

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface ChatInterfaceProps {
    onToggleSidebar: () => void;
    chatId?: string | null;
    parentId?: string | null;
    onChatCreated?: (chatId: string, title: string) => void;
}

export default function ChatInterface({
    onToggleSidebar,
    chatId: initialChatId,
    parentId,
    onChatCreated
}: ChatInterfaceProps) {
    const [selectedModel, setSelectedModel] = useState(MODELS[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentChatId, setCurrentChatId] = useState<string | null>(initialChatId || null);

    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingHistory, setIsFetchingHistory] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    // Reset or fetch history when chatId changes
    useEffect(() => {
        setCurrentChatId(initialChatId || null);
        if (initialChatId) {
            fetchChatHistory(initialChatId);
        } else {
            setMessages([]);
        }
    }, [initialChatId]);

    const fetchChatHistory = async (id: string) => {
        setIsFetchingHistory(true);
        try {
            const response = await fetch(`http://localhost:3001/chats/${id}`);
            if (response.ok) {
                const data = await response.json();
                const history: Message[] = data.messages.map((m: any, i: number) => ({
                    id: `${id}-${i}`,
                    role: m.role,
                    content: m.content
                }));
                setMessages(history);
            }
        } catch (error) {
            console.error("Failed to fetch chat history:", error);
        } finally {
            setIsFetchingHistory(false);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const preprocessMarkdown = (text: string) => {
        // OpenAI sends math in \( \) and \[ \] format, but remark-math expects $ $ and $$ $$
        return text
            .replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$') // inline math
            .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$'); // block math
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        try {
            const response = await fetch("http://localhost:3001/chats/stream", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: userMessage.content,
                    model: selectedModel.id,
                    chatId: currentChatId,
                    parentId: parentId
                }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No reader available");

            const assistantMessageId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, {
                id: assistantMessageId,
                role: "assistant",
                content: "",
            }]);

            const decoder = new TextDecoder();
            let accumulatedContent = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.content) {
                                accumulatedContent += data.content;
                                setMessages(prev => prev.map(msg =>
                                    msg.id === assistantMessageId
                                        ? { ...msg, content: accumulatedContent }
                                        : msg
                                ));
                            }

                            if (data.metadata) {
                                // New chat created
                                setCurrentChatId(data.metadata.chatId);
                                if (onChatCreated) {
                                    onChatCreated(data.metadata.chatId, data.metadata.title);
                                }
                            }
                        } catch (e) {
                            console.error("Error parsing stream chunk", e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: "assistant",
                content: "Sorry, I encountered an error. Please check your connection and OpenAI key.",
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen relative bg-background font-sans">
            {/* Header */}
            <header className="h-16 flex items-center px-4 justify-between backdrop-blur-md z-30 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-xl hover:bg-white/5 text-foreground/40 hover:text-heading transition-colors"
                    >
                        <Menu size={20} />
                    </button>

                    <span className="font-bold text-heading text-xl uppercase tracking-tighter ml-2 mr-4 select-none tracking-normal">MindMap</span>

                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-heading hover:bg-white/10 hover:border-white/20 transition-all focus:outline-none"
                        >
                            <span>{selectedModel.name}</span>
                            <ChevronDown size={14} className={`text-foreground/40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                <div className="absolute top-full left-0 mt-2 w-56 p-1 bg-card border border-secondary rounded-2xl shadow-2xl z-20 animate-node">
                                    {MODELS.map((model) => (
                                        <button
                                            key={model.id}
                                            onClick={() => {
                                                setSelectedModel(model);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group"
                                        >
                                            <div className="flex flex-col items-start">
                                                <span className={`text-xs font-bold ${selectedModel.id === model.id ? 'text-white' : 'text-heading'}`}>
                                                    {model.name}
                                                </span>
                                                <span className="text-[10px] text-foreground/40">{model.provider}</span>
                                            </div>
                                            {selectedModel.id === model.id && <Check size={14} className="text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-8 no-scrollbar"
            >
                <div className="max-w-3xl mx-auto space-y-12">
                    {isFetchingHistory ? (
                        <div className="flex flex-col items-center justify-center h-full pt-20 text-foreground/20 italic text-sm">
                            Retrieving knowledge...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full pt-20 text-foreground/20 italic text-sm">
                            Start a new topic to expand the map
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai w-full text-sm md:text-base leading-relaxed'}>
                                    {msg.role === 'assistant' && msg.content === "" && isLoading ? (
                                        <div className="flex gap-1 items-center h-6">
                                            <div className="w-1.5 h-1.5 rounded-full bg-foreground/20 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-1.5 h-1.5 rounded-full bg-foreground/20 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-1.5 h-1.5 rounded-full bg-foreground/20 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    ) : msg.role === 'user' ? (
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                    ) : (
                                        <article className="prose prose-invert prose-slate max-w-none 
                                            prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-4
                                            prose-strong:text-heading prose-strong:font-bold
                                            prose-headings:text-heading prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
                                            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ul:space-y-2
                                            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-ol:space-y-2
                                            prose-li:text-foreground/80
                                            prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
                                        ">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm, remarkMath]}
                                                rehypePlugins={[rehypeKatex]}
                                                components={{
                                                    pre({ children }) {
                                                        return <>{children}</>;
                                                    },
                                                    code({ node, inline, className, children, ...props }: any) {
                                                        const match = /language-(\w+)/.exec(className || '');
                                                        return !inline && match ? (
                                                            <div className="relative group my-2">
                                                                {/* Transparent-floating language tag */}
                                                                <div className="absolute top-0 right-4 px-2 py-1 bg-white/5 rounded-b-lg border-x border-b border-white/5 text-[9px] text-foreground/20 font-bold uppercase tracking-widest z-10 group-hover:text-primary transition-colors select-none">
                                                                    {match[1]}
                                                                </div>
                                                                <SyntaxHighlighter
                                                                    style={vscDarkPlus}
                                                                    language={match[1]}
                                                                    PreTag="div"
                                                                    className="rounded-xl border border-white/5 bg-white/2 shadow-sm"
                                                                    customStyle={{
                                                                        margin: 0,
                                                                        padding: '1.25rem',
                                                                        fontSize: 'inherit',
                                                                        lineHeight: '1.6',
                                                                        background: 'transparent',
                                                                    }}
                                                                    codeTagProps={{
                                                                        style: {
                                                                            background: 'transparent',
                                                                            display: 'block',
                                                                        }
                                                                    }}
                                                                    {...props}
                                                                >
                                                                    {String(children).trim()}
                                                                </SyntaxHighlighter>
                                                            </div>
                                                        ) : (
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        );
                                                    },
                                                }}
                                            >
                                                {preprocessMarkdown(msg.content)}
                                            </ReactMarkdown>
                                        </article>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-8 pt-0">
                <div className="max-w-4xl mx-auto relative group">
                    <div className="relative flex items-end gap-2 p-2 rounded-2xl bg-card border border-secondary shadow-sm group-focus-within:border-foreground/50 transition-all duration-300">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask anything..."
                            rows={1}
                            className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-sm py-4 px-6 text-heading resize-none placeholder:text-foreground/30 max-h-48 overflow-y-auto no-scrollbar"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${Math.min(target.scrollHeight, 192)}px`;
                            }}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            className={`h-12 w-12 rounded-full flex items-center justify-center text-black transition-all mb-0.5 mr-0.5 shrink-0
                                ${inputValue.trim() && !isLoading
                                    ? 'bg-primary hover:scale-105 active:scale-95'
                                    : 'bg-white/5 text-foreground/20 cursor-not-allowed'}`}
                        >
                            <CornerDownLeft size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
