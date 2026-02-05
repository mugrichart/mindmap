"use client";

import React from "react";
import { ChevronRight, Folder, MessageSquare } from "lucide-react";
import { Node } from "@/lib/data";

interface TopicsMapProps {
    data: Node[];
    currentStack: Node[];
    onNavigate: (newStack: Node[]) => void;
}

export default function TopicsMap({ data, currentStack, onNavigate }: TopicsMapProps) {
    const currentId = currentStack.length > 0 ? currentStack[currentStack.length - 1].id : null;

    // Check if a node is in the current family line
    const isInFamilyLine = (nodeId: string) => {
        return currentStack.some(node => node.id === nodeId);
    };

    // Recursive component to render nodes
    const renderNode = (node: Node, level: number = 0, path: Node[] = []) => {
        // If stack is empty, we don't dim anything at the top level
        const isCurrentLine = currentStack.length === 0 ? true : isInFamilyLine(node.id);
        const isTarget = currentId === node.id;
        const newPath = [...path, node];

        return (
            <div key={node.id} className="flex flex-col">
                <button
                    onClick={() => onNavigate(newPath)}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all border outline-none text-left w-fit
                        ${isCurrentLine
                            ? 'bg-primary/5 border-primary/20 text-heading shadow-[0_0_20px_rgba(250,250,250,0.05)] cursor-pointer'
                            : 'opacity-20 hover:opacity-40 border-transparent text-foreground cursor-pointer'
                        }
                        ${isTarget ? 'ring-1 ring-primary' : ''}
                    `}
                >
                    <div className={`p-2 rounded-lg ${node.type === 'folder' ? 'bg-secondary/20 text-secondary' : 'bg-primary/10 text-primary'}`}>
                        {node.type === 'folder' ? <Folder size={16} /> : <MessageSquare size={16} />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold truncate max-w-[200px]">{node.label}</span>
                        <span className="text-[10px] opacity-40 uppercase tracking-tighter font-medium">{node.type}</span>
                    </div>
                    {node.type === "folder" && node.children && node.children.length > 0 && (
                        <ChevronRight size={14} className="ml-auto opacity-20" />
                    )}
                </button>

                {node.children && node.children.length > 0 && (
                    <div className="ml-8 mt-4 pl-8 border-l border-white/5 space-y-4">
                        {node.children.map(child => renderNode(child, level + 1, newPath))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full flex justify-center py-12">
            <div className="flex flex-col gap-8 max-w-4xl w-full">
                {data.map(rootNode => renderNode(rootNode, 0, []))}
            </div>
        </div>
    );
}
