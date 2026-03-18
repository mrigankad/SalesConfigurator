import { useState } from 'react';
import { CheckCircle2, Clock, Package, ChevronDown, ChevronUp, UserCircle2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { findClientRecord } from '../../data/pastProjects';
import type { PastProject } from '../../data/pastProjects';
import { useChatStore } from '../../store/chatStore';

interface Props {
  onSubmit: (projects: string, lastEngagement: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Ongoing: 'bg-amber-50 text-amber-700 border-amber-200',
  'In Review': 'bg-brand-50 text-brand-700 border-brand-200',
};

const TYPE_COLOR: Record<string, string> = {
  'Virtual Twin': 'bg-brand-500',
  'CAD Integration': 'bg-violet-500',
  'Configurator': 'bg-teal-500',
  'VR Experience': 'bg-rose-500',
  'PLM Migration': 'bg-amber-500',
};

function ProjectRow({ project, selected, onToggle }: {
  project: PastProject;
  selected: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        selected
          ? 'border-brand-400 shadow-sm shadow-brand-100'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Row header */}
      <div className="flex items-start gap-3 p-4">
        {/* Select toggle */}
        <button
          onClick={onToggle}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
            selected ? 'bg-brand-500 border-brand-500' : 'border-slate-300 bg-white'
          }`}
        >
          {selected && <CheckCircle2 size={12} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* Type pill */}
            <span className={`text-[9px] font-black text-white uppercase tracking-wider px-2 py-0.5 rounded-full ${TYPE_COLOR[project.type] ?? 'bg-slate-400'}`}>
              {project.type}
            </span>
            {/* Status badge */}
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${STATUS_STYLES[project.status]}`}>
              {project.status === 'Ongoing' && <Clock size={9} className="inline mr-0.5" />}
              {project.status}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">{project.year}</span>
          </div>

          <p className="text-sm font-bold text-slate-900 truncate">{project.title}</p>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{project.description}</p>

          {/* Budget */}
          <p className="text-[10px] font-semibold text-slate-400 mt-1">{project.value}</p>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer mt-0.5"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded highlights */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-slate-100 bg-slate-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 mb-2">Highlights</p>
              <div className="flex flex-wrap gap-1.5">
                {project.highlights.map(h => (
                  <span key={h} className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PreviousProjectsCard({ onSubmit }: Props) {
  // Read company name from Zustand store
  const companyName = useChatStore(s => s.userData.company_name);
  const record = findClientRecord(companyName);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleProject = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleContinue = () => {
    if (record) {
      const selected = record.projects.filter(p => selectedIds.has(p.id));
      const projectSummary = selected.length > 0
        ? selected.map(p => p.title).join(', ')
        : record.projects.map(p => p.title).join(', ');
      const lastYear = record.projects
        .map(p => p.year)
        .sort()
        .reverse()[0];
      onSubmit(projectSummary, lastYear);
    } else {
      onSubmit('Previous engagement confirmed', '');
    }
  };

  // ── No record found: fallback to free-text form ────────────────────────────
  if (!record) {
    return <FallbackForm onSubmit={onSubmit} />;
  }

  return (
    <div className="space-y-3">
      {/* Account summary */}
      <div className="bg-gradient-to-r from-brand-500 to-[#0077b6] rounded-xl p-4 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Star size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-100">Valued Customer</p>
            <p className="font-bold text-sm">{record.companyName}</p>
          </div>
          <span className="ml-auto text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
            Since {record.since}
          </span>
        </div>
        <div className="flex items-center gap-2 text-brand-100 text-xs">
          <UserCircle2 size={13} />
          <span>Account Manager: <span className="font-semibold text-white">{record.accountManager}</span></span>
        </div>
      </div>

      {/* Projects list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-slate-700">
            <Package size={12} className="inline mr-1 text-slate-400" />
            {record.projects.length} project{record.projects.length > 1 ? 's' : ''} on record
          </p>
          <p className="text-[10px] text-slate-400">Select to reference in your new quote</p>
        </div>
        <div className="space-y-2">
          {record.projects.map(p => (
            <ProjectRow
              key={p.id}
              project={p}
              selected={selectedIds.has(p.id)}
              onToggle={() => toggleProject(p.id)}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-2.5 bg-brand-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-[0.98] cursor-pointer"
      >
        Continue →
      </button>
    </div>
  );
}

// ── Fallback for unknown companies ─────────────────────────────────────────────
function FallbackForm({ onSubmit }: { onSubmit: (p: string, e: string) => void }) {
  const [projects, setProjects] = useState('');
  const [lastEngagement, setLastEngagement] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!projects.trim()) { setError('Please describe your previous projects.'); return; }
    setError('');
    onSubmit(projects.trim(), lastEngagement.trim());
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Previous Projects</label>
        <textarea
          value={projects}
          onChange={e => setProjects(e.target.value)}
          placeholder="e.g. 3D visualization, VR experience, configurator..."
          rows={2}
          className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Last Engagement</label>
        <input
          type="text"
          value={lastEngagement}
          onChange={e => setLastEngagement(e.target.value)}
          placeholder="e.g. Q1 2024"
          className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        />
      </div>
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
      <button
        onClick={handleSubmit}
        className="w-full py-2.5 bg-brand-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-brand-600 transition-all cursor-pointer"
      >
        Continue →
      </button>
    </div>
  );
}
