"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import TopicsMap from "@/components/TopicsMap";
import { useAuth } from "@/contexts/AuthContext";

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const { token, user, isLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMapOpen, setIsMapOpen] = useState(false);

    // The chat currently shown.
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [navigationStack, setNavigationStack] = useState<any[]>([]);
    const [mapLevels, setMapLevels] = useState<any[][]>([]);

    // Authentication Guard
    useEffect(() => {
        if (!isLoading && !token) {
            router.push('/login');
        }
    }, [token, isLoading, router]);

    // Sync with URL ID
    useEffect(() => {
        if (!token) return;
        const idFromUrl = Array.isArray(params.id) ? params.id[0] : params.id;
        if (idFromUrl && idFromUrl !== activeChatId) {
            handleUrlChange(idFromUrl);
        } else if (!idFromUrl) {
            setActiveChatId(null);
            setNavigationStack([]);
        }
    }, [params.id, token]);

    const handleUrlChange = async (id: string) => {
        if (!token) return;
        try {
            const response = await fetch(`http://localhost:3001/chats/${id}/ancestry`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const ancestry = await response.json();
                setNavigationStack(ancestry);
                setActiveChatId(id);
            }
        } catch (error) {
            console.error("Failed to sync with URL:", error);
        }
    };

    useEffect(() => {
        if (isMapOpen && token) {
            fetchMapLevels();
        }
    }, [isMapOpen, navigationStack, token]);

    const fetchMapLevels = async () => {
        if (!token) return;
        try {
            // Level 0: Roots
            const rootsRes = await fetch("http://localhost:3001/chats", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!rootsRes.ok) return;
            const rootsData = await rootsRes.json();

            const newLevels = [rootsData.map((c: any) => ({
                id: c._id,
                label: c.title,
                type: 'folder',
                bestQuizScore: c.bestQuizScore,
                quizTaken: c.quizTaken,
                bestExamScore: c.bestExamScore,
                examTaken: c.examTaken
            }))];

            // For each node in stack, fetch its children to form the next column
            for (let i = 0; i < navigationStack.length; i++) {
                const node = navigationStack[i];
                const res = await fetch(`http://localhost:3001/chats/${node.id}/children`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const childrenData = await res.json();
                    if (childrenData.length > 0) {
                        newLevels.push(childrenData.map((c: any) => ({
                            id: c._id,
                            label: c.title,
                            type: 'folder',
                            bestQuizScore: c.bestQuizScore,
                            quizTaken: c.quizTaken,
                            bestExamScore: c.bestExamScore,
                            examTaken: c.examTaken
                        })));
                    } else {
                        break;
                    }
                }
            }
            setMapLevels(newLevels);
        } catch (error) {
            console.error("Error fetching map levels:", error);
        }
    };

    if (isLoading || !token) {
        return (
            <div className="h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const navigateTo = (id: string | null) => {
        if (id) {
            router.push(`/chats/${id}`);
        } else {
            router.push('/chats');
        }
    };

    const handleNodeClick = (node: any) => {
        navigateTo(node.id);
    };

    const handleBack = () => {
        const newStack = navigationStack.slice(0, -1);
        if (newStack.length > 0) {
            navigateTo(newStack[newStack.length - 1].id);
        } else {
            navigateTo(null);
        }
    };

    const handleSetStack = (newStack: any[]) => {
        if (newStack.length > 0) {
            navigateTo(newStack[newStack.length - 1].id);
        } else {
            navigateTo(null);
        }
    };

    const handleNewChat = () => {
        setActiveChatId(null);
        // We don't necessarily clear the stack here if we want to stay in context,
        // but the URL should reflect we are in a "new" state for the current parent.
        // For now, let's just stick to the current parent logic.
    };

    const handleChatCreated = (chatId: string, title: string) => {
        navigateTo(chatId);
    };

    const parentId = navigationStack.length > 0
        ? navigationStack[navigationStack.length - 1].id
        : null;

    const handleMapNavigate = (newStack: any[]) => {
        if (newStack.length > 0) {
            navigateTo(newStack[newStack.length - 1].id);
        } else {
            navigateTo(null);
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
