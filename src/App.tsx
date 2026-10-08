/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { DiscoveryChatbot } from './components/DiscoveryChatbot.tsx';
import { CatalogExplorer } from './components/CatalogExplorer.tsx';
import { ArchitectureView } from './components/ArchitectureView.tsx';
import { ALL_INTERNAL_PROJECTS } from './data/groundTruth.ts';

export default function App() {
  const [activeView, setActiveView] = useState<'chat' | 'catalog' | 'architecture'>('chat');
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

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

  // Check backend health and API key link status
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.hasGeminiKey === 'boolean') {
          setHasApiKey(data.hasGeminiKey);
        }
      })
      .catch((err) => {
        console.warn('Health check error:', err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        onToggleTheme={toggleTheme}
        totalProjectsCount={ALL_INTERNAL_PROJECTS.length}
        hasApiKey={hasApiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeView === 'chat' && <DiscoveryChatbot />}
        {activeView === 'catalog' && <CatalogExplorer assets={ALL_INTERNAL_PROJECTS} />}
        {activeView === 'architecture' && <ArchitectureView />}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-5 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>AI Solution Discovery &amp; Reuse Engine • 10 Enterprise Divisions</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>HCS</span>
            <span>•</span>
            <span>IAS</span>
            <span>•</span>
            <span>SEC</span>
            <span>•</span>
            <span>PRM</span>
            <span>•</span>
            <span>OPM</span>
            <span>•</span>
            <span>HOS</span>
            <span>•</span>
            <span>FIN</span>
            <span>•</span>
            <span>SCM</span>
            <span>•</span>
            <span>DAT</span>
            <span>•</span>
            <span>CXM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
