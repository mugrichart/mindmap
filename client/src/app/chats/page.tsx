import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
    return (
        <div className="flex bg-background h-screen overflow-hidden text-foreground selection:bg-primary/30">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none grid-bg opacity-30" />
            <div className="fixed -top-[30%] -right-[10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full" />

            <Sidebar />
            <ChatInterface />
        </div>
    );
}
