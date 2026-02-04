"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Folder, MessageSquare, Plus, Home } from "lucide-react";

interface Node {
    id: string;
    label: string;
    type: "folder" | "chat";
    children?: Node[];
}

const MOCK_DATA: Node[] = [
    {
        id: "1",
        label: "Artificial Intelligence",
        type: "folder",
        children: [
            {
                id: "1-1",
                label: "Machine Learning",
                type: "folder",
                children: [
                    { id: "1-1-1", label: "Supervised Learning", type: "chat" },
                    { id: "1-1-2", label: "Unsupervised Learning", type: "chat" },
                    {
                        id: "1-1-3",
                        label: "Neural Networks",
                        type: "folder",
                        children: [
                            { id: "1-1-3-1", label: "Backpropagation", type: "chat" },
                            { id: "1-1-3-2", label: "Transformers", type: "chat" }
                        ]
                    }
                ]
            },
            { id: "1-2", label: "Natural Language Processing", type: "chat" }
        ]
    },
    {
        id: "2",
        label: "Economics",
        type: "folder",
        children: [
            {
                id: "2-1",
                label: "Microeconomics",
                type: "folder",
                children: [
                    { id: "2-1-1", label: "Supply and Demand", type: "chat" },
                    { id: "2-1-2", label: "Consumer Theory", type: "chat" }
                ]
            },
            { id: "2-2", label: "Macroeconomics", type: "chat" }
        ]
    }
];

export default function Sidebar() {
    const [isAnimating, setIsAnimating] = useState(true);
    const [navigationStack, setNavigationStack] = useState<Node[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const handleFolderClick = (node: Node) => {
        if (node.type === "folder") {
            setNavigationStack([...navigationStack, node]);
        }
    };

    const goBack = () => {
        setNavigationStack(navigationStack.slice(0, -1));
    };

    const currentLevel = navigationStack.length > 0
        ? navigationStack[navigationStack.length - 1].children || []
        : MOCK_DATA;

    const currentTitle = navigationStack.length > 0
        ? navigationStack[navigationStack.length - 1].label
        : "Topics";

    return (
        <aside className={`h-screen sidebar-glass flex flex-col transition-all duration-500 overflow-hidden ${isAnimating ? 'animate-sidebar' : 'w-72'}`}>
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-primary flex items-center justify-center font-bold text-xs text-white uppercase shadow-[0_0_10px_rgba(59,130,246,0.5)]">M</div>
                    <span className="font-bold text-heading tracking-tight">Mind Map</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-1">
                {/* Active Topic Indicator */}
                <div className="px-3 py-4 mb-2 rounded-2xl bg-primary/10 border border-primary/20">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Active Topic</p>
                    <p className="text-sm font-bold text-heading line-clamp-1">{currentTitle}</p>
                </div>

                {navigationStack.length > 0 && (
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground/50 hover:text-heading transition-colors group mb-4"
                    >
                        <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                        Back
                    </button>
                )}

                <div className="space-y-1">
                    {currentLevel.map((node, i) => (
                        <button
                            key={node.id}
                            onClick={() => node.type === "folder" ? handleFolderClick(node) : null}
                            style={{ animationDelay: `${i * 50}ms` }}
                            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group animate-node"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${node.type === 'folder' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                    {node.type === 'folder' ? <Folder size={16} /> : <MessageSquare size={16} />}
                                </div>
                                <span className="text-sm font-medium text-foreground/80 group-hover:text-heading transition-colors line-clamp-1 text-left">
                                    {node.label}
                                </span>
                            </div>
                            {node.type === "folder" && (
                                <ChevronRight size={14} className="text-foreground/20 group-hover:text-foreground/50 group-hover:translate-x-0.5 transition-all" />
                            )}
                        </button>
                    ))}

                    {/* New Chat at the current level */}
                    <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group border border-dashed border-white/5 mt-2">
                        <div className="p-2 rounded-lg bg-white/5 text-foreground/40 group-hover:text-primary transition-colors">
                            <Plus size={16} />
                        </div>
                        <span className="text-sm font-medium text-foreground/40 group-hover:text-heading transition-colors">
                            New Chat
                        </span>
                    </button>
                </div>
            </div>

            {/* Avatar at Bottom */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center text-xs font-bold text-heading">
                        JD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-heading">John Doe</span>
                        <span className="text-[9px] text-foreground/40 uppercase tracking-tighter cursor-pointer hover:text-primary transition-colors flex items-center gap-1">
                            Settings
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
