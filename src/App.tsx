import MembersList from "./features/members/MembersList";
import { Toaster } from "@/components/ui/sonner";
import { Dumbbell } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="group/header relative overflow-hidden bg-slate-900 text-white transition-colors duration-500">
        <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-violet-500/25 blur-3xl transition-transform duration-700 ease-out group-hover/header:scale-125" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 size-72 rounded-full bg-cyan-400/10 blur-3xl transition-transform duration-700 ease-out group-hover/header:scale-150" />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div className="group/logo flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-violet-600 shadow-lg shadow-violet-950/40 transition-all duration-300 ease-out group-hover/logo:rotate-6 group-hover/logo:scale-110 group-hover/logo:shadow-xl group-hover/logo:shadow-violet-900/60">
              <Dumbbell className="size-6 text-white transition-transform duration-300 group-hover/logo:scale-110" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight transition-colors duration-300 group-hover/logo:text-violet-100">
                Gym Management
              </p>
              <p className="text-xs text-slate-400">Members dashboard</p>
            </div>
          </div>
          <span className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:text-white sm:inline-block">
            Admin Panel
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <MembersList />
      </main>

      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export default App;
