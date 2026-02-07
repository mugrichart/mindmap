import { useState, useEffect } from "react";
import { ChevronRight, Folder, MessageSquare, Plus, GitGraph } from "lucide-react";

import { Node } from "@/lib/data";

interface SidebarProps {
    isOpen: boolean;
    navigationStack: Node[];
    onFolderClick: (node: Node) => void;
    onBack: () => void;
    onSetStack: (stack: Node[]) => void;
    onShowMap: () => void;
    onNewChat: () => void;
}

export default function Sidebar({
    isOpen,
    navigationStack,
    onFolderClick,
    onBack,
    onSetStack,
    onShowMap,
    onNewChat
}: SidebarProps) {
    const [currentLevelData, setCurrentLevelData] = useState<Node[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [navigationStack]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const lastNode = navigationStack.length > 0 ? navigationStack[navigationStack.length - 1] : null;
            const url = lastNode
                ? `http://localhost:3001/chats/${lastNode.id}/children`
                : `http://localhost:3001/chats`;

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                const nodes: Node[] = data.map((chat: any) => ({
                    id: chat._id,
                    label: chat.title,
                    type: "folder" // We treat all chats as folders since they can have subtopics
                }));
                setCurrentLevelData(nodes);
            }
        } catch (error) {
            console.error("Failed to fetch sidebar data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFolderClick = (node: Node) => {
        onFolderClick(node);
    };

    const goBack = () => {
        onBack();
    };

    const currentTitle = navigationStack.length > 0
        ? navigationStack[navigationStack.length - 1].label
        : "Topics";

    return (
        <aside
            className={`h-screen sidebar-glass flex flex-col transition-all duration-300 ease-in-out overflow-hidden z-40 ${isOpen ? 'w-72' : 'w-0 border-none'
                }`}
        >

            <div className="flex-1 overflow-y-auto px-3 pt-6 space-y-1">

                {/* Active Topic Indicator - Only show if in a sub-level */}
                {navigationStack.length > 0 && (
                    <div className="px-3 py-4 mb-2 rounded-xl bg-secondary/20 border border-secondary transition-colors whitespace-nowrap">
                        <p className="text-[10px] font-bold text-foreground uppercase tracking-[0.2em] mb-1">Active Topic</p>
                        <p className="text-sm font-bold text-heading line-clamp-1">{currentTitle}</p>
                    </div>
                )}

                {navigationStack.length > 0 && (
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground/50 hover:text-heading transition-colors group mb-4 whitespace-nowrap"
                    >
                        <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                        Back
                    </button>
                )}

                <div className="px-3 py-2">
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
                        {navigationStack.length === 0 ? "Topics" : "Subtopics"}
                    </p>
                </div>

                <div className="space-y-1">
                    {isLoading ? (
                        <div className="px-3 py-4 text-xs text-foreground/30 italic">Loading...</div>
                    ) : (
                        currentLevelData.map((node) => (
                            <button
                                key={node.id}
                                onClick={() => handleFolderClick(node)}
                                className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group whitespace-nowrap"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                                        <Folder size={16} />
                                    </div>
                                    <span className="text-sm font-medium text-foreground/80 group-hover:text-heading transition-colors line-clamp-1 text-left">
                                        {node.label}
                                    </span>
                                </div>
                                <ChevronRight size={14} className="text-foreground/20 group-hover:text-foreground/50 group-hover:translate-x-0.5 transition-all" />
                            </button>
                        ))
                    )}

                    <button
                        onClick={onNewChat}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group border border-dashed border-white/5 mt-2 whitespace-nowrap"
                    >
                        <div className="p-2 rounded-lg bg-white/5 text-foreground/40 group-hover:text-primary transition-colors">
                            <Plus size={16} />
                        </div>
                        <span className="text-sm font-medium text-foreground/40 group-hover:text-heading transition-colors">
                            {navigationStack.length === 0 ? "New Topic" : "New Subtopic"}
                        </span>
                    </button>

                    <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                        <div className="px-3">
                            <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.2em]">Genealogy Trace</p>
                            {navigationStack.length > 0 ? (
                                <div className="flex items-center gap-1 mt-2 flex-wrap max-w-full overflow-hidden">
                                    {navigationStack.map((node, i) => (
                                        <div key={node.id} className="flex items-center gap-1">
                                            <span
                                                className="text-[10px] text-foreground/30 hover:text-foreground/60 cursor-pointer transition-colors max-w-[80px] truncate"
                                                onClick={() => onSetStack(navigationStack.slice(0, i + 1))}
                                            >
                                                {node.label}
                                            </span>
                                            {i < navigationStack.length - 1 && <ChevronRight size={10} className="text-foreground/20" />}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[10px] text-foreground/10 italic mt-2">At root level</p>
                            )}
                        </div>

                        <button
                            onClick={onShowMap}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group border border-dashed border-white/5 whitespace-nowrap"
                        >
                            <div className="p-2 rounded-lg bg-white/5 text-foreground/40 group-hover:text-primary transition-colors">
                                <GitGraph size={16} />
                            </div>
                            <span className="text-sm font-medium text-foreground/40 group-hover:text-heading transition-colors">
                                Explore Topics Map
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Avatar at Bottom */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 whitespace-nowrap">
                    <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-heading">
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
