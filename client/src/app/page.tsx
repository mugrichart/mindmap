"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { token, isLoading } = useAuth();

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground grid-bg">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] h-[50%] w-[50%] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] h-[40%] w-[40%] rounded-full bg-white/5 blur-[100px]" />
      </div>

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-24 pb-32 sm:px-12 lg:pt-32">
        {/* Navigation */}
        <nav className="fixed top-6 left-1/2 flex w-[90%] max-w-4xl -translate-x-1/2 items-center justify-between rounded-full bg-card/60 px-6 py-3 backdrop-blur-xl border border-white/5 shadow-2xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <span className="text-black font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-heading">Mind Map</span>
          </Link>
          <div className="hidden gap-8 text-sm font-medium sm:flex">
            <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">Features</a>
            <a href="#vision" className="text-foreground/80 hover:text-primary transition-colors">Methodology</a>
            <a href="#" className="text-foreground/80 hover:text-primary transition-colors">Documentation</a>
          </div>
          <div className="flex items-center gap-4">
            {!isLoading && token ? (
              <Link href="/chats" className="rounded-full bg-primary/10 border border-primary/20 px-5 py-2 text-sm font-bold text-primary transition-all hover:bg-primary/20 active:scale-95">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login?mode=login" className="hidden text-sm font-semibold text-foreground/80 hover:text-heading transition-colors sm:block">
                  Sign In
                </Link>
                <Link href="/login?mode=signup" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-black transition-all hover:scale-105 active:scale-95">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Professional Tool for Deep Learning
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-extrabold leading-[1.1] text-heading sm:text-7xl">
            Where your thoughts <br /> find their <span className="opacity-40 italic">rightful place</span>.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/80 sm:text-xl">
            Stop losing insights in a sea of linear chats. Mind Map is the spatial intelligence layer
            that organizes your AI interactions into a living, hierarchical knowledge base.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link href={!isLoading && token ? "/chats" : "/login?mode=signup"} className="group relative flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-black transition-all hover:scale-105 active:scale-95">
              {!isLoading && token ? "Open your Map" : "Start Mapping"}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
            <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-lg font-bold text-heading backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 active:scale-95">
              Watch Demo
            </button>
          </div>
        </section>

        {/* Visual Teaser - Left-to-Right Hierarchy */}
        <section className="mt-24 w-full max-w-5xl rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-sm shadow-2xl">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/5 bg-zinc-900/50">
            <svg width="100%" height="100%" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Horizontal lines connecting levels */}
              <path d="M120 225 H200 M240 225 H320 M240 225 Q280 225 320 125 M240 225 Q280 225 320 325" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
              <path d="M360 125 H440 M360 325 H440" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />

              {/* Nodes - Level 0 */}
              <circle cx="100" cy="225" r="30" className="fill-primary/20 stroke-primary/40" strokeWidth="2" />
              <text x="100" y="228" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">WORKSPACE</text>

              {/* Nodes - Level 1 */}
              <rect x="200" y="205" width="80" height="40" rx="8" className="fill-white/5 stroke-white/20" strokeWidth="1" />
              <text x="240" y="230" textAnchor="middle" fill="white" fontSize="10">LEARNING</text>

              {/* Nodes - Level 2 */}
              <rect x="320" y="105" width="100" height="40" rx="8" className="fill-white/5 stroke-secondary/40" strokeWidth="1" />
              <text x="370" y="130" textAnchor="middle" fill="white" fontSize="9">DATA SCIENCE</text>

              <rect x="320" y="205" width="100" height="40" rx="8" className="fill-white/5 stroke-white/20" strokeWidth="1" />
              <text x="370" y="230" textAnchor="middle" fill="white" fontSize="9">ECONOMICS</text>

              <rect x="320" y="305" width="100" height="40" rx="8" className="fill-white/5 stroke-white/20" strokeWidth="1" />
              <text x="370" y="330" textAnchor="middle" fill="white" fontSize="9">PHILOSOPHY</text>

              {/* Nodes - Level 3 (Details) */}
              <circle cx="460" cy="125" r="15" className="fill-secondary/30 stroke-secondary" strokeWidth="1" />
              <text x="490" y="128" fill="rgba(255,255,255,0.4)" fontSize="8">Active Node</text>
            </svg>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/80 to-transparent p-6 text-center">
              <span className="text-white/40 text-xs font-mono tracking-widest uppercase italic">Proprietary Hierarchical Mapping Framework</span>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section id="vision" className="mt-40 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-heading sm:text-5xl">Linear chat is dead. <br /> Structured expertise is here.</h2>
          <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
            The current AI paradigm is optimized for transactions, not mastery. Mind Map
            reimagines AI interaction as a spatial discipline, where every answer is an
            anchor for future knowledge.
          </p>
        </section>

        {/* Features Section */}
        <section id="features" className="mt-32 grid w-full max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Spatial Anchoring"
            desc="Context isn't just a window; it's a location. Navigate your learning as a physical entity."
            icon="📍"
          />
          <FeatureCard
            title="Recursive Mastery"
            desc="Break down any topic into infinite sub-levels. Deep-dive without losing the breadth."
            icon="🧬"
          />
          <FeatureCard
            title="Knowledge Grafting"
            desc="Interconnect disparate topics. Watch your Data Science and Philosophy nodes collide."
            icon="🔌"
          />
        </section>

        {/* Educational Layer */}
        <section className="mt-48 flex w-full max-w-5xl flex-col gap-24 lg:flex-row lg:items-center">
          <div className="flex-1 text-left">
            <h3 className="text-3xl font-bold text-heading">Built for High-Stakes Learning</h3>
            <p className="mt-6 text-lg text-foreground/70">
              Mind Map isn't just another note-taking tool. It's an accountability engine.
              Visualize the gaps in your knowledge and fill them systematically.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <span className="text-heading font-bold">100%</span>
                <p className="text-xs text-foreground/40 mt-1 uppercase tracking-wider font-semibold">Context Persistence</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <span className="text-heading font-bold">∞</span>
                <p className="text-xs text-foreground/40 mt-1 uppercase tracking-wider font-semibold">Hierarchical Depth</p>
              </div>
            </div>
          </div>
          <div className="h-[400px] flex-1 rounded-3xl border border-white/5 bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
            <div className="relative z-10 text-6xl group-hover:scale-110 transition-transform duration-500">🧠</div>
            <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/20 uppercase">Core Processor V1</div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-64 relative w-full max-w-4xl rounded-[3rem] bg-primary/5 p-12 overflow-hidden border border-primary/10 text-center">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-64 w-64 rounded-full bg-primary/20 blur-[80px]"></div>
          <h2 className="text-4xl font-bold text-heading">Start your map today.</h2>
          <p className="mt-6 text-lg text-foreground/60 max-w-xl mx-auto font-medium">
            Join the private beta. Experience the future of intellectual structure.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Link href="/login?mode=signup" className="rounded-full bg-primary px-10 py-5 text-xl font-bold text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              Get Started for Free
            </Link>
            <p className="text-xs text-foreground/40 italic">No credit card required. Invite-only access.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-64 w-full border-t border-white/5 pt-12 text-center text-sm text-foreground/40 pb-12">
          <div className="flex justify-center gap-8 mb-8">
            <a href="#" className="hover:text-heading transition-colors font-medium">Privacy</a>
            <a href="#" className="hover:text-heading transition-colors font-medium">Terms</a>
            <a href="#" className="hover:text-heading transition-colors font-medium text-heading/60">Follow Progress</a>
          </div>
          <p>© 2026 Mind Map. Built for the intellectual frontier.</p>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="group flex flex-col gap-4 rounded-3xl border border-white/5 bg-card/40 p-10 backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-white/5 hover:-translate-y-1 shadow-sm hover:shadow-2xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-2xl transition-transform group-hover:scale-110 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-heading">{title}</h3>
      <p className="leading-relaxed text-foreground/70">{desc}</p>
    </div>
  );
}
