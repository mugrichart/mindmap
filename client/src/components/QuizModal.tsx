"use client";

import { useState } from "react";
import { X, CheckCircle2, ChevronRight, Award } from "lucide-react";

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    userAnswer?: number;
}

interface QuizModalProps {
    quizId: string;
    type: 'quiz' | 'exam';
    questions: Question[];
    onClose: () => void;
    onComplete: (score: number) => void;
}

export default function QuizModal({ quizId, type, questions, onClose, onComplete }: QuizModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState<{ score: number; maxScore: number } | null>(null);

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:3001/chats/quiz/${quizId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers })
            });
            if (response.ok) {
                const quiz = await response.json();
                setResults({ score: quiz.score, maxScore: quiz.maxScore });
                onComplete(quiz.score);
            }
        } catch (error) {
            console.error('Failed to submit quiz:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-xl animate-fade-in" onClick={results ? onClose : undefined} />

            <div className="relative w-full max-w-2xl bg-card border border-white/5 rounded-[40px] shadow-2xl overflow-hidden animate-node">
                {!results ? (
                    <div className="flex flex-col h-[500px]">
                        {/* Header */}
                        <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5">
                            <div>
                                <h3 className="text-xl font-bold text-heading uppercase tracking-tighter">
                                    {type === 'quiz' ? 'Knowledge Check' : 'Topic Examination'}
                                </h3>
                                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">
                                    Question {currentIndex + 1} of {questions.length}
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-foreground/20 hover:text-heading transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1 w-full bg-white/5">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Question Content */}
                        <div className="flex-1 p-10 overflow-y-auto no-scrollbar">
                            <h4 className="text-lg font-bold text-heading leading-relaxed mb-8">
                                {currentQuestion.question}
                            </h4>

                            <div className="grid gap-3">
                                {currentQuestion.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswerSelect(idx)}
                                        className={`w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all group
                                            ${answers[currentIndex] === idx
                                                ? 'bg-primary/5 border-primary/40 text-heading shadow-lg'
                                                : 'bg-white/2 border-white/5 text-foreground/60 hover:border-white/20 hover:bg-white/4'
                                            }
                                        `}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                            ${answers[currentIndex] === idx ? 'border-primary bg-primary text-black' : 'border-white/10 group-hover:border-white/30'}
                                        `}>
                                            <span className="text-[10px] font-black">{String.fromCharCode(65 + idx)}</span>
                                        </div>
                                        <span className="text-sm font-medium">{option}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex gap-1">
                                {questions.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1.5 h-1.5 rounded-full transition-colors 
                                            ${i === currentIndex ? 'bg-primary' : i < answers.length ? 'bg-primary/30' : 'bg-white/5'}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={answers[currentIndex] === undefined || isSubmitting}
                                className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all
                                    ${answers[currentIndex] !== undefined && !isSubmitting
                                        ? 'bg-primary text-black hover:scale-105 active:scale-95'
                                        : 'bg-white/5 text-foreground/20 cursor-not-allowed'
                                    }
                                `}
                            >
                                <span>{currentIndex === questions.length - 1 ? 'Complete' : 'Continue'}</span>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-16 flex flex-col items-center text-center animate-fade-in">
                        <div className="w-24 h-24 rounded-[32px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-8 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                            <Award size={48} />
                        </div>

                        <h3 className="text-3xl font-black text-heading uppercase tracking-tighter mb-2">
                            Performance Review
                        </h3>
                        <p className="text-sm text-foreground/40 mb-10 uppercase tracking-widest font-bold">
                            {type === 'quiz' ? 'Quiz' : 'Exam'} Completed Successfully
                        </p>

                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
                            <div className="p-6 rounded-3xl bg-white/2 border border-white/5">
                                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Score</p>
                                <p className="text-3xl font-black text-heading">{results.score}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/2 border border-white/5">
                                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Percentage</p>
                                <p className="text-3xl font-black text-primary">
                                    {Math.round((results.score / results.maxScore) * 100)}%
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="px-12 py-4 bg-primary text-black rounded-[24px] font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all"
                        >
                            Return to Mapping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
