import { useState } from 'react';
import { CheckCircle2, Phone, Download, Calendar, Clock, Shield, TrendingUp, Zap, Globe, FileText, Building2, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { UserData } from '../../types';
import { BookingModal } from './BookingModal';

interface Props {
  userData: UserData;
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

function quoteRef() {
  const seed = Date.now().toString(36).toUpperCase().slice(-6);
  return `DS-${seed}`;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

const LINE_ITEMS = [
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
        <path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
      </svg>
    ),
    label: 'Model Engineering',
    description: 'Geometry cleanup, LOD & material assignment',
    hours: 560,
    amount: 24500,
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    label: 'Virtual Twin Sync',
    description: 'Pipelines, variant logic & real-time sync',
    hours: 280,
    amount: 12350,
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
      </svg>
    ),
    label: 'Cloud Compute',
    description: '3DEXPERIENCE hosting, CI/CD & monitoring',
    hours: 80,
    amount: 6000,
  },
];

const TOTAL = LINE_ITEMS.reduce((s, l) => s + l.amount, 0);
const TOTAL_HOURS = LINE_ITEMS.reduce((s, l) => s + l.hours, 0);

async function handleExportPdf(userData: UserData) {
  const { generateQuotePdf } = await import('../../lib/generateQuotePdf');
  generateQuotePdf(userData);
}

export function ResultsCard({ userData }: Props) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + 30);
  const ref = quoteRef();

  const company = userData.company_name || 'Your Company';
  const contact = userData.name || 'Valued Customer';
  const modelName = userData.model_name || 'Project';

  const scopeRows = [
    { label: 'Model', value: userData.model_name },
    { label: 'Variants', value: userData.unique_variants_count ? `${userData.unique_variants_count} grades` : null },
    { label: 'Segment', value: userData.segment },
    { label: 'Trim Levels', value: userData.trim_levels ? `${userData.trim_levels} trims` : null },
    { label: 'Colors', value: userData.exterior_colors ? `${userData.exterior_colors} exterior` : null },
    { label: 'Markets', value: userData.markets },
    { label: 'Customization', value: userData.customization_level },
    { label: 'CAD Format', value: userData.cad_format },
    { label: 'Update Cycle', value: userData.update_frequency },
  ].filter(r => r.value);

  return (
    <div className="w-full space-y-3 pb-8">

      {/* ── QUOTE CARD ─────────────────────────────────────── */}
      <motion.div {...fadeUp(0.05)} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

        {/* Hero header */}
        <div className="bg-[#005589] px-5 py-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <FileText size={11} className="text-blue-300" />
              <span className="text-[9px] font-black text-blue-300 uppercase tracking-[0.25em]">Quotation</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight leading-none">
              <span className="text-xl text-blue-300 align-top mt-1 inline-block mr-0.5">$</span>
              {TOTAL.toLocaleString()}
            </h2>
            <p className="text-[10px] text-blue-300 font-semibold tracking-widest uppercase mt-1.5">USD · End-to-End Delivery</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[9px] text-blue-300 uppercase tracking-widest font-bold mb-1">Quote Ref</p>
            <p className="text-white font-mono font-bold text-sm">{ref}</p>
            <p className="text-[10px] text-blue-200 mt-1">Issued {formatDate(today)}</p>
            <p className="text-[10px] text-blue-200">Valid until {formatDate(validUntil)}</p>
          </div>
        </div>

        {/* Prepared for */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-500 shrink-0">
              <Building2 size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Prepared for</p>
              <p className="text-sm font-bold text-slate-900 truncate leading-tight">{company}</p>
              <p className="text-[10px] text-slate-500 truncate">{contact}{userData.email ? ` · ${userData.email}` : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1">
            <CheckCircle2 size={10} className="text-emerald-500" />
            <span className="text-[9px] font-bold text-emerald-600 whitespace-nowrap">Assessment Complete</span>
          </div>
        </div>

        {/* Line items */}
        <div className="px-5 pt-4 pb-2">
          <div className="grid grid-cols-[1fr_auto_auto] text-[9px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100 gap-x-4">
            <span>Service</span>
            <span className="text-right">Hrs</span>
            <span className="text-right w-20">Amount</span>
          </div>
          {LINE_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              {...fadeUp(0.12 + i * 0.07)}
              className="grid grid-cols-[1fr_auto_auto] items-center py-3 border-b border-slate-50 gap-x-4 last:border-0"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-500 shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{item.label}</p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.description}</p>
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-400 text-right tabular-nums">{item.hours}h</p>
              <p className="text-sm font-bold text-slate-900 text-right w-20 tabular-nums">${item.amount.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-5 pb-4 space-y-1.5 border-t border-slate-100 pt-3">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Subtotal</span><span className="tabular-nums">${TOTAL.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Tax (0% — B2B Enterprise)</span><span>$0</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
            <span className="text-sm font-black text-slate-900">Total</span>
            <span className="text-xl font-black text-brand-600 tabular-nums">${TOTAL.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer — stats + CTAs */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex gap-5">
            {[
              { label: 'Effort', value: `${TOTAL_HOURS}h`, icon: <Clock size={11} className="text-emerald-500" /> },
              { label: 'Lead Time', value: '14 Days', icon: <Calendar size={11} className="text-brand-500" /> },
              { label: 'Valid For', value: '30 Days', icon: <Shield size={11} className="text-amber-500" /> },
            ].map(s => (
              <div key={s.label}>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1">{s.icon}{s.value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setBookingOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-brand-600 transition-all cursor-pointer shadow-sm"
            >
              <CheckCircle2 size={11} />Secure Quote
            </button>
            <button
              onClick={() => handleExportPdf(userData)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Download size={11} />PDF
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── PROJECT SCOPE ──────────────────────────────────── */}
      {scopeRows.length > 0 && (
        <motion.div {...fadeUp(0.3)} className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Project Scope — <span className="text-brand-500">{modelName}</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            {scopeRows.map(row => (
              <div key={row.label} className="bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">{row.label}</p>
                <p className="text-xs font-bold text-slate-800 truncate">{row.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── WHY DASSAULT — BENTO GRID ──────────────────────── */}
      <motion.div {...fadeUp(0.45)} className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-sm font-black text-slate-900">Why Dassault Systèmes?</h3>
          <span className="text-[10px] text-slate-400 font-medium">Trusted by 300K+ companies</span>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 grid-rows-3 gap-2">

          {/* Cell 1 — Large hero: ROI (spans 2 rows) */}
          <motion.div
            {...fadeUp(0.5)}
            className="row-span-2 bg-[#005589] rounded-2xl p-4 flex flex-col justify-between overflow-hidden relative"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-400/10 rounded-full" />
            <div className="relative z-10">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white mb-3">
                <TrendingUp size={18} />
              </div>
              <h4 className="text-base font-black text-white leading-tight mb-1">Long Term ROI</h4>
              <p className="text-[11px] text-blue-200 leading-relaxed">Virtual Twins cut time-to-market by 25% and eliminate physical prototyping costs.</p>
            </div>
            <div className="relative z-10 mt-3 flex items-center gap-1 text-blue-300">
              <span className="text-[10px] font-bold uppercase tracking-wider">Learn more</span>
              <ArrowUpRight size={12} />
            </div>
          </motion.div>

          {/* Cell 2 — Industry Standard */}
          <motion.div
            {...fadeUp(0.55)}
            className="bg-slate-900 rounded-2xl p-4 flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white mb-2">
              <Zap size={16} />
            </div>
            <div>
              <h4 className="text-sm font-black text-white leading-tight">Industry Standard</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Trusted by the world's top OEMs on the 3DEXPERIENCE platform.</p>
            </div>
          </motion.div>

          {/* Cell 3 — Integration */}
          <motion.div
            {...fadeUp(0.6)}
            className="bg-brand-50 border border-brand-100 rounded-2xl p-4 flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 mb-2">
              <Globe size={16} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 leading-tight">Seamless Integration</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">SOLIDWORKS, CATIA & existing PLM — plug-and-play.</p>
            </div>
          </motion.div>

          {/* Cell 4 — Security (spans 2 cols) */}
          <motion.div
            {...fadeUp(0.65)}
            className="col-span-2 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Shield size={18} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 leading-tight">Enterprise-Grade Security</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Your IP is protected by ISO 27001 certified cloud infrastructure — zero compromise on data sovereignty.</p>
            </div>
            <div className="ml-auto shrink-0 text-right">
              <p className="text-2xl font-black text-emerald-600">ISO</p>
              <p className="text-[10px] font-bold text-emerald-500 -mt-1">27001</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── CTA BANNER ─────────────────────────────────────── */}
      <motion.div
        {...fadeUp(0.7)}
        className="bg-gradient-to-r from-slate-900 to-[#005589] rounded-2xl p-4 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
            <Phone size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-tight">Ready to move forward?</p>
            <p className="text-slate-300 text-[11px] mt-0.5">Our architects will confirm final pricing.</p>
          </div>
        </div>
        <button
          onClick={() => setBookingOpen(true)}
          className="shrink-0 px-4 py-2.5 bg-brand-400 hover:bg-brand-300 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer"
        >
          Schedule a Call
        </button>
      </motion.div>

      {/* ── LEGAL ──────────────────────────────────────────── */}
      <p className="text-center text-[9px] text-slate-400 leading-relaxed px-2">
        Quote {ref} · Valid 30 days from {formatDate(today)} · Indicative pricing subject to detailed scoping · © {today.getFullYear()} Dassault Systèmes SE
      </p>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        userEmail={userData.email}
        userName={userData.name}
      />
    </div>
  );
}
