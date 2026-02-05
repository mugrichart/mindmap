"use client";

export interface Node {
    id: string;
    label: string;
    type: "folder" | "chat";
    children?: Node[];
}

export const MOCK_DATA: Node[] = [
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
