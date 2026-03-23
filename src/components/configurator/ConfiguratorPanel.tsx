import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Circle, Armchair, Layers, ChevronRight } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { CarScene, type CameraAngle } from './CarScene';
import { cn } from '../../lib/cn';

// ─── Data ─────────────────────────────────────────────────────────────────────

const COLOR_GROUPS = [
  {
    label: 'Metallic',
    colors: [
      { hex: '#C0C0C0', name: 'Silver' },
      { hex: '#D4AF37', name: 'Champagne Gold' },
      { hex: '#003153', name: 'Cobalt Blue' },
      { hex: '#C41E3A', name: 'Carmine Red' },
    ],
  },
  {
    label: 'Solid',
    colors: [
      { hex: '#1C1C1C', name: 'Midnight Black' },
      { hex: '#F5F5F0', name: 'Pearl White' },
      { hex: '#355E3B', name: 'Racing Green' },
      { hex: '#E8D5B7', name: 'Sahara Beige' },
    ],
  },
];

const ALL_COLORS = COLOR_GROUPS.flatMap(g => g.colors);

const WHEEL_OPTIONS = [
  {
    id: 0,
    name: 'Sport Dark',
    desc: 'Matte black alloys',
    preview: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="18" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
        <circle cx="20" cy="20" r="12" fill="#111" stroke="#222" strokeWidth="1"/>
        {[0,72,144,216,288].map(a => (
          <line key={a} x1="20" y1="8" x2="20" y2="20" stroke="#2a2a2a" strokeWidth="3"
            transform={`rotate(${a} 20 20)`}/>
        ))}
        <circle cx="20" cy="20" r="3" fill="#333"/>
      </svg>
    ),
  },
  {
    id: 1,
    name: 'Classic Silver',
    desc: 'Polished chrome finish',
    preview: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="18" fill="#C0C0C0" stroke="#aaa" strokeWidth="1"/>
        <circle cx="20" cy="20" r="12" fill="#d4d4d4" stroke="#bbb" strokeWidth="1"/>
        {[0,72,144,216,288].map(a => (
          <line key={a} x1="20" y1="8" x2="20" y2="20" stroke="#e8e8e8" strokeWidth="3"
            transform={`rotate(${a} 20 20)`}/>
        ))}
        <circle cx="20" cy="20" r="3" fill="#aaa"/>
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Carbon',
    desc: 'Lightweight carbon fiber',
    preview: (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="18" fill="#111" stroke="#222" strokeWidth="1"/>
        <circle cx="20" cy="20" r="12" fill="#0a0a0a" stroke="#1a1a1a" strokeWidth="1"/>
        {[0,60,120,180,240,300].map(a => (
          <line key={a} x1="20" y1="8" x2="20" y2="20" stroke="#1e1e1e" strokeWidth="2.5"
            transform={`rotate(${a} 20 20)`}/>
        ))}
        <circle cx="20" cy="20" r="3" fill="#222"/>
      </svg>
    ),
  },
];

const INTERIOR_OPTIONS = [
  { id: 'black', name: 'Onyx Black',  swatch: '#1a1a1a', accent: '#2a2a2a', desc: 'Full black leather' },
  { id: 'tan',   name: 'Saddle Tan',  swatch: '#C2956C', accent: '#a87d55', desc: 'Warm tan leather' },
  { id: 'red',   name: 'Ferrari Red', swatch: '#8B0000', accent: '#6b0000', desc: 'Sport red leather' },
];

const CAM_ANGLES: { id: CameraAngle; label: string }[] = [
  { id: 'front', label: 'Front' },
  { id: 'side',  label: 'Side'  },
  { id: 'rear',  label: 'Rear'  },
  { id: 'top',   label: 'Top'   },
];

const TABS = [
  { id: 'color'    as const, label: 'Exterior', icon: Palette },
  { id: 'wheels'   as const, label: 'Wheels',   icon: Circle },
  { id: 'interior' as const, label: 'Interior',  icon: Armchair },
  { id: 'trim'     as const, label: 'Trim',      icon: Layers },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ConfiguratorPanel() {
  const configurator  = useChatStore(s => s.configurator);
  const setConfig     = useChatStore(s => s.setConfigurator);
  const userData      = useChatStore(s => s.userData);

  const [activeTab, setActiveTab]   = useState<'color' | 'wheels' | 'interior' | 'trim'>('color');
  const [cameraAngle, setCameraAngle] = useState<CameraAngle | null>(null);

  const trimCount = Math.min(parseInt(userData.trim_levels as string ?? '3', 10) || 3, 4);
  const trimNames = ['Base', 'Sport', 'Premium', 'Ultimate'];

  const selectedColorName = ALL_COLORS.find(c => c.hex === configurator.selectedColor)?.name ?? 'Custom';
  const selectedWheelName = WHEEL_OPTIONS[configurator.selectedWheel]?.name ?? '—';
  const selectedInteriorName = INTERIOR_OPTIONS.find(o => o.id === configurator.selectedInterior)?.name ?? '—';
  const selectedTrimName = trimNames[configurator.selectedTrim] ?? `Trim ${configurator.selectedTrim + 1}`;

  return (
    <div className="flex h-full overflow-hidden rounded-xl">

      {/* ── 3D VIEWER ─────────────────────────────────────────────── */}
      <div className="flex-1 relative min-w-0 bg-[#0d0d14]">
        <CarScene config={configurator} cameraAngle={cameraAngle} />

        {/* Model badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/10">
            {userData.model_name || 'Vehicle'}
            <span className="text-white/40 ml-1.5 font-normal">Virtual Twin</span>
          </div>
        </div>

        {/* Camera angle presets */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {CAM_ANGLES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setCameraAngle(id)}
              className={cn(
                'text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all cursor-pointer',
                cameraAngle === id
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-black/40 backdrop-blur-sm text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Drag hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-sm text-white/50 text-[9px] px-3 py-1 rounded-full pointer-events-none">
          Drag to rotate  ·  Scroll to zoom
        </div>

        {/* Config summary bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-6 pb-3 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { label: selectedTrimName,     color: 'bg-white/10' },
              { label: selectedColorName,    color: 'bg-white/10' },
              { label: selectedWheelName,    color: 'bg-white/10' },
              { label: selectedInteriorName, color: 'bg-white/10' },
            ].map((item, i) => (
              <span key={i} className={`${item.color} text-white/80 text-[9px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm border border-white/10`}>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── SIDEBAR CONTROLS ──────────────────────────────────────── */}
      <div className="w-[200px] shrink-0 flex flex-col bg-white border-l border-slate-200 overflow-hidden">

        {/* Tab icons */}
        <div className="flex border-b border-slate-100">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              title={label}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-all cursor-pointer text-[9px] font-bold uppercase tracking-wide',
                activeTab === id
                  ? 'text-brand-500 bg-brand-50 border-b-2 border-brand-500 -mb-px'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'color' && (
              <motion.div
                key="color"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="p-3 space-y-4"
              >
                {COLOR_GROUPS.map(group => (
                  <div key={group.label}>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">{group.label}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {group.colors.map(c => (
                        <button
                          key={c.hex}
                          title={c.name}
                          onClick={() => setConfig(p => ({ ...p, selectedColor: c.hex }))}
                          className="flex flex-col items-center gap-1 cursor-pointer group"
                        >
                          <div
                            className={cn(
                              'w-9 h-9 rounded-full border-2 transition-all shadow-sm',
                              configurator.selectedColor === c.hex
                                ? 'border-brand-500 scale-110 shadow-brand-200 shadow-md ring-2 ring-brand-200'
                                : 'border-slate-200 group-hover:border-slate-400 group-hover:scale-105'
                            )}
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className={cn(
                            'text-[8px] font-medium leading-tight text-center',
                            configurator.selectedColor === c.hex ? 'text-brand-600' : 'text-slate-400'
                          )}>
                            {c.name.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'wheels' && (
              <motion.div
                key="wheels"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="p-3 space-y-2"
              >
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Wheel Style</p>
                {WHEEL_OPTIONS.map(w => (
                  <button
                    key={w.id}
                    onClick={() => setConfig(p => ({ ...p, selectedWheel: w.id }))}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg border-2 transition-all cursor-pointer text-left',
                      configurator.selectedWheel === w.id
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                    )}
                  >
                    <div className="w-9 h-9 shrink-0">
                      {w.preview}
                    </div>
                    <div className="min-w-0">
                      <p className={cn('text-[11px] font-bold leading-tight', configurator.selectedWheel === w.id ? 'text-brand-700' : 'text-slate-700')}>
                        {w.name}
                      </p>
                      <p className="text-[9px] text-slate-400 leading-tight mt-0.5">{w.desc}</p>
                    </div>
                    {configurator.selectedWheel === w.id && (
                      <ChevronRight size={12} className="ml-auto text-brand-500 shrink-0" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}

            {activeTab === 'interior' && (
              <motion.div
                key="interior"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="p-3 space-y-2"
              >
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Interior Color</p>
                {INTERIOR_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setConfig(p => ({ ...p, selectedInterior: opt.id }))}
                    className={cn(
                      'w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg border-2 transition-all cursor-pointer text-left',
                      configurator.selectedInterior === opt.id
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                    )}
                  >
                    {/* Leather swatch preview */}
                    <div className="shrink-0 w-9 h-9 rounded-lg overflow-hidden border border-slate-200 relative">
                      <div className="absolute inset-0" style={{ backgroundColor: opt.swatch }} />
                      {/* Faux stitch line */}
                      <div className="absolute inset-[4px] rounded border border-dashed border-white/20" />
                    </div>
                    <div className="min-w-0">
                      <p className={cn('text-[11px] font-bold leading-tight', configurator.selectedInterior === opt.id ? 'text-brand-700' : 'text-slate-700')}>
                        {opt.name}
                      </p>
                      <p className="text-[9px] text-slate-400 leading-tight mt-0.5">{opt.desc}</p>
                    </div>
                    {configurator.selectedInterior === opt.id && (
                      <ChevronRight size={12} className="ml-auto text-brand-500 shrink-0" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}

            {activeTab === 'trim' && (
              <motion.div
                key="trim"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="p-3 space-y-2"
              >
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Trim Level</p>
                {Array.from({ length: trimCount }, (_, i) => {
                  const features: Record<number, string[]> = {
                    0: ['17" alloys', 'Cloth seats', 'Manual climate'],
                    1: ['19" sport alloys', 'Sport leather seats', 'Dual-zone climate'],
                    2: ['20" alloys', 'Nappa leather', 'Adaptive cruise'],
                    3: ['21" alloys', 'Full Nappa leather', 'All driver aids'],
                  };
                  return (
                    <button
                      key={i}
                      onClick={() => setConfig(p => ({ ...p, selectedTrim: i }))}
                      className={cn(
                        'w-full text-left px-3 py-2.5 rounded-lg border-2 transition-all cursor-pointer',
                        configurator.selectedTrim === i
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn('text-[11px] font-bold', configurator.selectedTrim === i ? 'text-brand-700' : 'text-slate-700')}>
                          {trimNames[i]}
                        </span>
                        {configurator.selectedTrim === i && (
                          <span className="text-[8px] font-bold text-brand-500 bg-brand-100 px-1.5 py-0.5 rounded-full">Active</span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        {(features[i] ?? []).map((f, fi) => (
                          <p key={fi} className="text-[9px] text-slate-400 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                            {f}
                          </p>
                        ))}
                      </div>
                    </button>
                  );
                })}
                <p className="text-[9px] text-slate-400 mt-1 px-1">
                  {trimCount} trim{trimCount !== 1 ? 's' : ''} configured for {userData.model_name || 'this model'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
