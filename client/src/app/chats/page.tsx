"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import TopicsMap from "@/components/TopicsMap";

export default function ChatPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [navigationStack, setNavigationStack] = useState<any[]>([]);
    const [isMapOpen, setIsMapOpen] = useState(false);

    // The chat currently shown. If null, we are starting a NEW topic in the current context.
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [mapLevels, setMapLevels] = useState<any[][]>([]);

    useEffect(() => {
        if (isMapOpen) {
            fetchMapLevels();
        }
    }, [isMapOpen, navigationStack]);

    const fetchMapLevels = async () => {
        try {
            // Level 0: Roots
            const rootsRes = await fetch("http://localhost:3001/chats");
            if (!rootsRes.ok) return;
            const rootsData = await rootsRes.json();

            const newLevels = [rootsData.map((c: any) => ({ id: c._id, label: c.title, type: 'folder' }))];

            // For each node in stack, fetch its children to form the next column
            for (let i = 0; i < navigationStack.length; i++) {
                const node = navigationStack[i];
                const res = await fetch(`http://localhost:3001/chats/${node.id}/children`);
                if (res.ok) {
                    const childrenData = await res.json();
                    if (childrenData.length > 0) {
                        newLevels.push(childrenData.map((c: any) => ({ id: c._id, label: c.title, type: 'folder' })));
                    } else {
                        // Even if no children, we might want to show an empty column hint, but for now we stop
                        break;
                    }
                }
            }
            setMapLevels(newLevels);
        } catch (error) {
            console.error("Error fetching map levels:", error);
        }
    };

    const handleNodeClick = (node: any) => {
        setNavigationStack([...navigationStack, node]);
        setActiveChatId(node.id);
    };

    const handleBack = () => {
        const newStack = navigationStack.slice(0, -1);
        setNavigationStack(newStack);
        if (newStack.length > 0) {
            setActiveChatId(newStack[newStack.length - 1].id);
        } else {
            setActiveChatId(null);
        }
    };

    const handleSetStack = (newStack: any[]) => {
        setNavigationStack(newStack);
        if (newStack.length > 0) {
            setActiveChatId(newStack[newStack.length - 1].id);
        } else {
            setActiveChatId(null);
        }
    };

    const handleNewChat = () => {
        // Clearing activeChatId means ChatInterface will start a new conversation
        // parentId will be the last item in stack if there is one
        setActiveChatId(null);
    };

    const handleChatCreated = (chatId: string, title: string) => {
        // When a new chat is created by ChatInterface, it becomes the head of our current context
        const newNode = { id: chatId, label: title, type: "folder" }; // Folders can have subtopics
        const newStack = [...navigationStack, newNode];
        setNavigationStack(newStack);
        setActiveChatId(chatId);
    };

    const parentId = navigationStack.length > 0
        ? navigationStack[navigationStack.length - 1].id
        : null;

    const handleMapNavigate = (newStack: any[]) => {
        setNavigationStack(newStack);
        if (newStack.length > 0) {
            setActiveChatId(newStack[newStack.length - 1].id);
        } else {
            setActiveChatId(null);
        }
        setIsMapOpen(false);
    };

    return (
        <div className="flex bg-background h-screen overflow-hidden text-foreground selection:bg-primary/30 relative">
            <Sidebar
                isOpen={sidebarOpen}
                navigationStack={navigationStack}
                onFolderClick={handleNodeClick}
                onBack={handleBack}
                onSetStack={handleSetStack}
                onShowMap={() => setIsMapOpen(true)}
                onNewChat={handleNewChat}
            />
            <ChatInterface
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                chatId={activeChatId}
                parentId={parentId}
                onChatCreated={handleChatCreated}
            />

            {isMapOpen && (
                <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl flex items-center justify-center p-6 sm:p-12 animate-in fade-in duration-300">
                    <div className="bg-card w-full h-full rounded-[2.5rem] border border-secondary shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col scale-in-center animate-in duration-500">
                        <div className="p-10 border-b border-white/5 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-heading tracking-tight">Topics map</h2>
                                <p className="text-[10px] text-foreground/40 uppercase tracking-[0.3em] font-bold mt-2">Spatial Knowledge genealogy</p>
                            </div>
                            <button
                                onClick={() => setIsMapOpen(false)}
                                className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
                            >
                                Resume Mapping
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <TopicsMap
                                levels={mapLevels}
                                currentStack={navigationStack}
                                onNavigate={handleMapNavigate}
                            />
                        </div>
                        <div className="p-6 bg-white/2 border-t border-white/5 flex justify-center italic text-[10px] text-foreground/30 uppercase tracking-widest font-medium">
                            Click any node to navigate instantly
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
