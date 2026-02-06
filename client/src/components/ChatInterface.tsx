"use client";

import { useState, useRef, useEffect } from "react";
import { User, ChevronDown, Check, CornerDownLeft, Menu } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

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
}

export default function ChatInterface({ onToggleSidebar }: ChatInterfaceProps) {
    const [selectedModel, setSelectedModel] = useState(MODELS[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "user",
            content: "Explain how backpropagation works in deep neural networks.",
        },
        {
            id: "2",
            role: "assistant",
            content: "Backpropagation is a key algorithm used for training artificial neural networks and plays a crucial role in the success of many machine learning models, particularly deep learning. It is a supervised learning algorithm that aims to minimize the error between the predicted output of a network and the actual target values by adjusting the weights of the network. Here is a step-by-step explanation of how backpropagation works:\n\n1. **Initialization**: \n   - Start with a neural network that has a set architecture with an input layer, one or more hidden layers, and an output layer. \n   - Initialize the weights and biases of the network with small random values.\n\n2. **Forward Pass**:\n   - Input data is passed through the network. Each neuron processes the input using a weighted sum and an activation function to produce an output.\n   - This output is passed to the next layer until the final output of the network is produced.\n\n3. **Compute Error (Loss Function)**:\n   - The output from the forward pass is compared to the true target values using a loss function (such as mean squared error for regression tasks or cross-entropy loss for classification tasks).\n   - The loss function quantifies how far the network's predictions are from the actual target values.\n\n4. **Backward Pass (Backpropagation)**:\n   - **Error Propagation**: The error from the output layer is propagated backward through the network. This is where the term \"backpropagation\" comes from.\n   - **Gradient Calculation**: Using calculus and chain rule, compute the gradient of the loss function with respect to each weight in the network. This is done using the derivative of the loss with respect to the network’s output, and then applying the chain rule through each neuron back to the inputs.\n   - **Chain Rule**: For each neuron, the gradient is calculated by multiplying the gradient of the neuron’s activation with the gradient of the loss function with respect to the neuron's output. This allows for calculating how much each neuron and weight in the network contributed to the error.\n\n5. **Weight Update**:\n   - Use the calculated gradients to update the weights and biases in the network. This is typically done using an optimization algorithm like Stochastic Gradient Descent (SGD), where weights are adjusted by subtracting the product of the learning rate and the gradient. \n   - \\( w_{\\text{new}} = w_{\\text{old}} - \\eta \\cdot \\nabla E \\), where \\( \\eta \\) is the learning rate, and \\( \\nabla E \\) is the gradient of the error.\n\n6. **Iteration**:\n   - The process is repeated for many epochs or iterations over the training dataset until the loss function converges to a minimum value, indicating that the model has learned to approximate the function mapping inputs to outputs effectively.\n\n7. **Convergence & Fine-Tuning**:\n   - Optionally, techniques like early stopping, learning rate schedules, and hyperparameter tuning can be employed to further optimize the training process and prevent overfitting.\n\nBackpropagation is effective because it provides a systematic method for updating the parameters of the model, making it possible to train very deep networks as used in modern deep learning applications.",
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
                            accumulatedContent += data.content;

                            setMessages(prev => prev.map(msg =>
                                msg.id === assistantMessageId
                                    ? { ...msg, content: accumulatedContent }
                                    : msg
                            ));
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
                    {messages.map((msg) => (
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
                                        >
                                            {preprocessMarkdown(msg.content)}
                                        </ReactMarkdown>
                                    </article>
                                )}
                            </div>
                        </div>
                    ))}
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
