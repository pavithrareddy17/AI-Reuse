import React from 'react';
import {
  MessageSquareCode,
  Building2,
  Sun,
  Moon,
  Cpu,
} from 'lucide-react';

interface Props {
  activeView: 'chat' | 'catalog';
  setActiveView: (view: 'chat' | 'catalog') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  totalProjectsCount: number;
}

export const Navbar: React.FC<Props> = ({
  activeView,
  setActiveView,
  theme,
  onToggleTheme,
  totalProjectsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Project Discovery &amp; Reuse Engine
              </h1>
              <span className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 text-[10px] font-mono font-medium">
                10 Depts
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Decision tree matching • 50 certified assets
            </p>
          </div>
        </div>

        {/* Focused 2 Tabs (Merged Match + Decision Tree into Chatbot) */}
        <nav className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveView('chat')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeView === 'chat'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquareCode className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Decision &amp; Matching Chat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('catalog')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeView === 'catalog'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Department Projects ({totalProjectsCount})</span>
          </button>
        </nav>

        {/* Right side: Theme Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
