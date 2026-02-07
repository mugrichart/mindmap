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

                                // Calculate progress percentage
                                // Max quiz score is 5, Max exam score is 15.
                                // Let's use the better of the two relative to their max as the overall mastery.
                                const quizRatio = (node.bestQuizScore || 0) / 5;
                                const examRatio = (node.bestExamScore || 0) / 15;
                                const masteryRatio = Math.max(quizRatio, examRatio);
                                const masteryPercent = Math.min(Math.round(masteryRatio * 100), 100);

                                return (
                                    <button
                                        key={node.id}
                                        onClick={() => {
                                            const newPath = currentStack.slice(0, levelIndex).concat(node);
                                            onNavigate(newPath);
                                        }}
                                        className={`w-full group relative flex items-start gap-4 p-4 rounded-3xl transition-all border text-left overflow-hidden
                                                ${isSelected
                                                ? 'bg-primary/5 border-primary/30 text-heading shadow-[0_0_30px_rgba(255,255,255,0.03)]'
                                                : 'bg-white/2 border-white/5 text-foreground/40 hover:bg-white/4 hover:text-foreground/80'
                                            }
                                            `}
                                    >
                                        {/* Progress Background */}
                                        {masteryPercent > 0 && (
                                            <div
                                                className="absolute inset-0 bg-primary/8 transition-all duration-1000 ease-out z-0"
                                                style={{ width: `${masteryPercent}%` }}
                                            />
                                        )}

                                        <div className={`relative z-10 mt-1 p-2 rounded-xl shrink-0 transition-colors
                                                ${isSelected ? 'bg-primary/20 text-primary' : 'bg-white/5 text-foreground/20 group-hover:bg-white/10'}
                                            `}>
                                            <Folder size={16} />
                                        </div>

                                        <div className="relative z-10 flex-1 min-w-0 flex flex-col gap-1">
                                            <span className={`text-sm font-bold leading-tight line-clamp-2 ${isSelected ? 'text-heading' : ''}`}>
                                                {node.label}
                                            </span>
                                            <div className="flex flex-col gap-2 mt-1">
                                                <div className="flex items-center gap-2">
                                                    {isSelected ? (
                                                        <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-primary font-bold">
                                                            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                                            Active Path
                                                        </div>
                                                    ) : masteryPercent > 0 ? (
                                                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">
                                                            {masteryPercent}% Mastered
                                                        </span>
                                                    ) : null}
                                                </div>

                                                {/* Baseline-aligned Horizontal Score Labels */}
                                                <div className="flex items-center gap-4 pt-1 border-t border-white/5">
                                                    <div className="flex items-baseline gap-1 min-w-0">
                                                        <span className="text-[7px] font-black text-foreground/20 uppercase tracking-tight">Quiz:</span>
                                                        <span className={`text-[10px] font-black ${node.quizTaken ? 'text-heading' : 'text-foreground/10'}`}>
                                                            {node.quizTaken ? `${Math.round((node.bestQuizScore || 0) / 5 * 100)}%` : '-'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1 min-w-0">
                                                        <span className="text-[7px] font-black text-foreground/20 uppercase tracking-tight">Exam:</span>
                                                        <span className={`text-[10px] font-black ${node.examTaken ? 'text-heading' : 'text-foreground/10'}`}>
                                                            {node.examTaken ? `${Math.round((node.bestExamScore || 0) / 15 * 100)}%` : '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <ChevronRight
                                            size={14}
                                            className={`relative z-10 mt-1 shrink-0 transition-all 
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
