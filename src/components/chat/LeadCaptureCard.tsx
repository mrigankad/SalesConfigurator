import { useState } from 'react';
import { User, Mail, Phone } from 'lucide-react';

interface Props {
  onSubmit: (name: string, email: string, phone: string) => void;
}

export function LeadCaptureCard({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    setError('');
    onSubmit(name.trim(), email.trim(), phone.trim());
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">Please fill in your details to get started:</p>
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name *</label>
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address *</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@company.com"
              className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Phone (Optional) */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Phone <span className="text-slate-300">(Optional)</span></label>
          <div className="relative">
            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-medium px-1">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-2.5 bg-brand-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-[0.98] cursor-pointer"
        >
          Continue Configuration →
        </button>
      </div>
    </div>
  );
}
