"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import TopicsMap from "@/components/TopicsMap";
import { MOCK_DATA } from "@/lib/data";

export default function ChatPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [navigationStack, setNavigationStack] = useState<any[]>([]);
    const [isMapOpen, setIsMapOpen] = useState(false);

    const handleFolderClick = (node: any) => {
        setNavigationStack([...navigationStack, node]);
    };

    const handleBack = () => {
        setNavigationStack(navigationStack.slice(0, -1));
    };

    const handleSetStack = (newStack: any[]) => {
        setNavigationStack(newStack);
    };

    const handleMapNavigate = (newStack: any[]) => {
        setNavigationStack(newStack);
        setIsMapOpen(false);
    };

    return (
        <div className="flex bg-background h-screen overflow-hidden text-foreground selection:bg-primary/30 relative">
            <Sidebar
                isOpen={sidebarOpen}
                navigationStack={navigationStack}
                onFolderClick={handleFolderClick}
                onBack={handleBack}
                onSetStack={handleSetStack}
                onShowMap={() => setIsMapOpen(true)}
            />
            <ChatInterface onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

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
                                data={MOCK_DATA}
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
