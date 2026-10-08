import React, { useState } from 'react';
import { InternalAsset } from '../types.ts';
import { DEPARTMENTS } from '../data/groundTruth.ts';
import {
  Layers,
  ShieldCheck,
  Clock,
  DollarSign,
  Search,
  Building2,
  Filter,
} from 'lucide-react';

interface Props {
  assets: InternalAsset[];
  onSelectProject?: (asset: InternalAsset) => void;
}

export const CatalogExplorer: React.FC<Props> = ({ assets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  const filteredAssets = assets.filter((asset) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return selectedDept === 'ALL' || asset.dept === selectedDept;

    const matchesSearch =
      asset.name.toLowerCase().includes(q) ||
      asset.id.toLowerCase().includes(q) ||
      asset.domain.toLowerCase().includes(q) ||
      asset.dept.toLowerCase().includes(q) ||
      asset.deptFullName.toLowerCase().includes(q) ||
      asset.techStack.toLowerCase().includes(q) ||
      asset.modality.toLowerCase().includes(q) ||
      asset.reusability.toLowerCase().includes(q);

    const matchesDept = selectedDept === 'ALL' || asset.dept === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>10 Enterprise Departments • 50 Certified Projects</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Department Project Repository
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Explore reusable AI assets and accelerators across all 10 divisions to eliminate duplicate work.
            </p>
          </div>

          <div className="w-full md:w-80 space-y-1.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, IP, latency, tech, domain..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
            {/* Quick search suggestions */}
            <div className="flex flex-wrap items-center gap-1 text-[10px]">
              <span className="text-slate-400">Quick:</span>
              {[
                { label: 'Device Latency', query: 'latency' },
                { label: 'Link Failover', query: 'failover' },
                { label: 'Teams/Email', query: 'teams' },
                { label: 'Cloud VPC', query: 'vpc' },
                { label: 'Firewall', query: 'firewall' },
                { label: 'PRM Quotas', query: 'quota' },
              ].map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => {
                    setSearchTerm(tag.query);
                    setSelectedDept('ALL');
                  }}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/40 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-mono transition cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 10 Departments Filter Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Filter className="w-3.5 h-3.5 text-indigo-500" />
            <span>Filter by Department:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedDept('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedDept === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Divisions ({assets.length})
            </button>
            {DEPARTMENTS.map((dept) => {
              const count = assets.filter((a) => a.dept === dept.code).length;
              return (
                <button
                  key={dept.code}
                  type="button"
                  onClick={() => setSelectedDept(dept.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    selectedDept === dept.code
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={dept.name}
                >
                  <span>{dept.code}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/40 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-600 text-white">
                  {asset.id}
                </span>

                {/* Requirement 4: Just dept names */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  <Building2 className="w-3 h-3 text-indigo-500" />
                  <span>Dept: {asset.dept}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {asset.name}
              </h3>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                {asset.deptFullName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {asset.domain}
              </p>

              <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-1.5">
                  <span className="text-slate-400 shrink-0">Tech:</span>
                  <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate">
                    {asset.techStack}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Setup: <strong>{asset.implementationEffort}</strong></span>
                </div>

                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Cost: <strong>{asset.estimatedRunCost}</strong></span>
                </div>

                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">Security: {asset.securityCompliance.split(',')[0]}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2">
              💡 {asset.lessonsLearned}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
