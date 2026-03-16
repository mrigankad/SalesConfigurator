import { CheckCircle2, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import type { UserData } from '../../types';

interface Props {
  userData: UserData;
}

export function ResultsCard({ userData }: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header section */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <CheckCircle2 size={12} className="text-brand-500" />
          Proposal Generated
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-black text-slate-900 tracking-tight"
        >
          Your Virtual Twin Investment
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed"
        >
          Based on the parameters provided for {userData.name || 'your project'}, we have formulated a customized timeline and cost breakdown utilizing our trusted enterprise solution architecture.
        </motion.p>
      </div>

      {/* Main Pricing Hero Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white border rounded-lg overflow-hidden shadow-[0_20px_40px_-12px_rgba(0,85,137,0.1)] border-slate-200"
      >
        <div className="bg-[#005589] p-8 text-white text-center relative overflow-hidden">
          {/* Subtle background glow/shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-xs font-bold text-brand-100 uppercase tracking-[0.2em] mb-4">
              Estimated Project Base
            </h3>
            <div className="flex items-start justify-center text-6xl font-black tracking-tighter mb-2">
              <span className="text-3xl mt-2 text-brand-200 mr-1">$</span>
              42,850
            </div>
            <p className="text-xs text-brand-200 font-medium tracking-wide">USD / END-TO-END DELIVERY</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model Engineering</p>
              <p className="text-xl font-black text-slate-900">$24,500</p>
              <p className="text-xs text-slate-500">Geometry cleanup & material assignment.</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Virtual Twin Sync</p>
              <p className="text-xl font-black text-slate-900">$12,350</p>
              <p className="text-xs text-slate-500">Data pipelines & real-time readiness.</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cloud Compute</p>
              <p className="text-xl font-black text-slate-900">$6,000</p>
              <p className="text-xs text-slate-500">3DEXPERIENCE platform infrastructure.</p>
            </div>
          </div>

          <div className="h-px w-full bg-slate-100" />

          {/* Effort Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Effort</p>
                <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  920 Hours
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Lead Time</p>
                <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                  14 Days
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-brand-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-brand-600 transition-all shadow-[0_10px_20px_-10px_rgba(0,85,137,0.5)] cursor-pointer hover:-translate-y-0.5">
                Secure Quote
              </button>
              <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-all cursor-pointer">
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Why DS grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <h3 className="text-lg font-black text-slate-900 text-center">Why Partner with Dassault Systèmes?</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 hover:border-brand-500 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
            </div>
            <h4 className="font-bold text-slate-900 mb-1 text-sm">Industry Standard</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Join the world's most innovative manufacturing leaders relying on the 3DEXPERIENCE platform.</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-slate-200 hover:border-brand-500 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h4 className="font-bold text-slate-900 mb-1 text-sm">Long Term ROI</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Virtual Twins reduce time-to-market by 25% and minimize physical prototyping costs.</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-slate-200 hover:border-brand-500 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/></svg>
            </div>
            <h4 className="font-bold text-slate-900 mb-1 text-sm">Seamless Integration</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Direct compatibility with SOLIDWORKS, CATIA, and existing PLM infrastructure.</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-slate-200 hover:border-brand-500 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h4 className="font-bold text-slate-900 mb-1 text-sm">Enterprise Security</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Your intellectual property is protected by ISO 27001 certified cloud infrastructure.</p>
          </div>
        </div>
      </motion.div>

      {/* CTA Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 shadow-lg">
            <Phone size={20} />
          </div>
          <div>
            <p className="text-white font-bold text-base mb-1">Ready to explore further?</p>
            <p className="text-slate-300 text-xs">Our solution architects are ready to review your project specs.</p>
          </div>
        </div>
        <button className="w-full sm:w-auto px-6 py-3 bg-brand-500 text-white rounded-lg text-xs font-bold hover:bg-brand-400 transition-all whitespace-nowrap cursor-pointer">
          Schedule Callback
        </button>
      </motion.div>
    </div>
  );
}
