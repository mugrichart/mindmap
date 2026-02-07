"use client";

import React from "react";
import { Folder, ChevronRight, MessageSquare } from "lucide-react";
import { Node } from "@/lib/data";

interface TopicsMapProps {
    levels: Node[][];
    currentStack: Node[];
    onNavigate: (newStack: Node[]) => void;
}

export default function TopicsMap({ levels, currentStack, onNavigate }: TopicsMapProps) {
    return (
        <div className="flex h-full overflow-x-auto no-scrollbar p-10 min-w-full">
            {levels.map((nodes, levelIndex) => {
                // The node in the current level that is part of the active path
                const selectedInThisLevel = currentStack[levelIndex];

                return (
                    <div
                        key={levelIndex}
                        className="flex flex-col gap-3 min-w-[280px] max-w-[320px] pr-8 border-r border-white/5 last:border-none"
                    >
                        <div className="flex items-center justify-between px-2 mb-2">
                            <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.2em]">
                                {levelIndex === 0 ? "Root Knowledge" : `Level ${levelIndex} Nodes`}
                            </span>
                            <span className="text-[10px] text-foreground/10">{nodes.length} items</span>
                        </div>

                        <div className="space-y-2 overflow-y-auto no-scrollbar pr-2 pb-10">
                            {nodes.map((node) => {
                                const isSelected = selectedInThisLevel?.id === node.id;
                                const isAncestor = currentStack.some((n, i) => i < levelIndex && n.id === node.id); // Not really possible in this layout but safe

                                return (
                                    <button
                                        key={node.id}
                                        onClick={() => {
                                            // Construct the new stack up to this level plus this node
                                            const newPath = currentStack.slice(0, levelIndex).concat(node);
                                            onNavigate(newPath);
                                        }}
                                        className={`w-full group flex items-start gap-4 p-4 rounded-3xl transition-all border text-left
                                            ${isSelected
                                                ? 'bg-primary/5 border-primary/30 text-heading shadow-[0_0_30px_rgba(255,255,255,0.03)]'
                                                : 'bg-white/2 border-white/5 text-foreground/40 hover:bg-white/4 hover:text-foreground/80'
                                            }
                                        `}
                                    >
                                        <div className={`mt-1 p-2 rounded-xl shrink-0 transition-colors
                                            ${isSelected ? 'bg-primary/20 text-primary' : 'bg-white/5 text-foreground/20 group-hover:bg-white/10'}
                                        `}>
                                            <Folder size={16} />
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                                            <span className={`text-sm font-bold leading-tight line-clamp-2 ${isSelected ? 'text-heading' : ''}`}>
                                                {node.label}
                                            </span>
                                            {isSelected && (
                                                <div className="flex items-center gap-1 mt-1 text-[9px] uppercase tracking-widest text-primary font-bold">
                                                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                                    Active Path
                                                </div>
                                            )}
                                        </div>

                                        <ChevronRight
                                            size={14}
                                            className={`mt-1 shrink-0 transition-all 
                                                ${isSelected ? 'text-primary translate-x-1' : 'text-white/5 group-hover:text-white/20'}
                                            `}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* Empty Level Placeholder to hint at further expansion */}
            {levels.length > 0 && levels[levels.length - 1].length > 0 && currentStack.length === levels.length && (
                <div className="flex flex-col gap-3 min-w-[280px] p-10 opacity-10">
                    <div className="h-full w-full border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center p-8 text-center">
                        <p className="text-xs font-medium italic">Deepen knowledge in the previous level to expand mapping here...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
