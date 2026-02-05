"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex bg-background h-screen overflow-hidden text-foreground selection:bg-primary/30">
            <Sidebar isOpen={sidebarOpen} />
            <ChatInterface onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>
    );
}
