"use client";

import { useState } from "react";
import { Send, User, ChevronDown, Check } from "lucide-react";

const MODELS = [
    { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
    { id: "claude-3-5", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
    { id: "deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek" },
];

export default function ChatInterface() {
    const [selectedModel, setSelectedModel] = useState(MODELS[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="flex-1 flex flex-col h-screen relative bg-background/50">
            {/* Header */}
            <header className="h-16 flex items-center px-8 justify-between backdrop-blur-md z-30">
                <div className="flex items-center gap-4">
                    {/* Custom Model Selector */}
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
                                <div className="absolute top-full left-0 mt-2 w-56 p-1 bg-card/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-20 animate-node">
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
                                                <span className={`text-xs font-bold ${selectedModel.id === model.id ? 'text-primary' : 'text-heading'}`}>
                                                    {model.name}
                                                </span>
                                                <span className="text-[10px] text-foreground/40">{model.provider}</span>
                                            </div>
                                            {selectedModel.id === model.id && <Check size={14} className="text-primary" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Right side empty as requested */}
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-4xl mx-auto w-full">
                <div className="flex gap-4 items-start">
                    <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/20 shrink-0">
                        <User size={16} />
                    </div>
                    <div className="chat-bubble-user p-4 text-sm leading-relaxed shadow-lg">
                        Explain how backpropagation works in deep neural networks.
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0 font-bold text-xs">
                        M
                    </div>
                    <div className="chat-bubble-ai p-5 text-sm leading-relaxed shadow-xl max-w-[85%]">
                        <p className="mb-4 font-bold">Concept Anchor: Gradient Descent</p>
                        <p>Backpropagation is essentially the efficient application of the chain rule from calculus to compute gradients in a neural network. It flows backward from the error at the output layer through all the connections to the inputs.</p>
                        <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 italic text-xs bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                            <span>💡 Relation Found: "Linear Regression - Gradient Descent"</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-8 pt-0">
                <div className="max-w-4xl mx-auto relative group">
                    <div className="absolute inset-0 bg-primary/0 blur-2xl group-focus-within:bg-primary/10 transition-all duration-500 rounded-[2rem]"></div>
                    <div className="relative flex items-end gap-2 p-2 rounded-[2rem] bg-card/60 backdrop-blur-2xl border border-white/10 shadow-2xl group-focus-within:border-primary/50 group-focus-within:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all duration-300">
                        <textarea
                            placeholder="Ask anything... Topics will auto-link."
                            rows={1}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-4 px-6 text-heading resize-none placeholder:text-foreground/30 max-h-48 overflow-y-auto custom-scrollbar"
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${Math.min(target.scrollHeight, 192)}px`;
                            }}
                        />
                        <button className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white hover:scale-105 hover:glow-blue active:scale-95 transition-all shadow-lg mb-0.5 mr-0.5 shrink-0">
                            <Send size={18} />
                        </button>
                    </div>
                    <div className="flex justify-center mt-4">
                        <p className="text-[10px] text-foreground/20 uppercase tracking-[0.3em] font-bold">Topic Mapping Interface</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
