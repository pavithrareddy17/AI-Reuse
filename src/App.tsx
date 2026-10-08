/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { DiscoveryChatbot } from './components/DiscoveryChatbot.tsx';
import { CatalogExplorer } from './components/CatalogExplorer.tsx';
import { ALL_INTERNAL_PROJECTS } from './data/groundTruth.ts';

export default function App() {
  const [activeView, setActiveView] = useState<'chat' | 'catalog'>('chat');

  // Theme Management (Light vs Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('app_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('app_theme', theme);
    } catch {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        onToggleTheme={toggleTheme}
        totalProjectsCount={ALL_INTERNAL_PROJECTS.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeView === 'chat' && <DiscoveryChatbot />}
        {activeView === 'catalog' && <CatalogExplorer assets={ALL_INTERNAL_PROJECTS} />}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-5 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Project Discovery &amp; Reuse Engine • 10 Enterprise Divisions</span>
          </div>
          <div className="flex items-center gap-2.5 text-[11px] font-mono text-slate-400">
            <span>HCS (Network)</span>
            <span>•</span>
            <span>IAS (IaaS)</span>
            <span>•</span>
            <span>SEC (Security)</span>
            <span>•</span>
            <span>NRE (Reliability)</span>
            <span>•</span>
            <span>PRM (Platform)</span>
            <span>•</span>
            <span>OPM (Operations)</span>
            <span>•</span>
            <span>HOS (Hosting)</span>
            <span>•</span>
            <span>SRE</span>
            <span>•</span>
            <span>DAT</span>
            <span>•</span>
            <span>FIN</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
