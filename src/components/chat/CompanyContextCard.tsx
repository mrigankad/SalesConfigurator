import { useState, useRef, useEffect, useCallback } from 'react';
import { Building2, Globe, Users, MapPin, ChevronRight } from 'lucide-react';

// ─── Hardcoded automotive / industrial companies (instant, offline) ───────────
const KNOWN_COMPANIES = [
  'BMW Group', 'BMW', 'MINI', 'Rolls-Royce',
  'Mercedes-Benz', 'Mercedes AMG', 'Daimler', 'Smart',
  'Volkswagen Group', 'Volkswagen', 'Audi', 'Porsche', 'SEAT', 'ŠKODA',
  'Lamborghini', 'Bentley', 'Bugatti',
  'Stellantis', 'Fiat', 'Peugeot', 'Citroën', 'Opel', 'Vauxhall',
  'Jeep', 'Dodge', 'Chrysler', 'RAM', 'Alfa Romeo', 'Maserati', 'DS Automobiles',
  'Toyota', 'Lexus', 'Daihatsu',
  'Honda', 'Acura',
  'Nissan', 'Infiniti', 'Mitsubishi',
  'Hyundai', 'Kia', 'Genesis',
  'Ford', 'Lincoln',
  'General Motors', 'Chevrolet', 'GMC', 'Buick', 'Cadillac',
  'Renault', 'Alpine',
  'Volvo Cars', 'Volvo',
  'Geely', 'Polestar', 'Lynk & Co',
  'SAIC Motor', 'MG Motor', 'Roewe', 'Hongqi', 'WEY',
  'BYD', 'NIO', 'XPeng', 'Li Auto',
  'Tata Motors', 'Jaguar', 'Land Rover',
  'Mahindra', 'Mahindra and Mahindra', 'Maruti Suzuki', 'Suzuki',
  'Tesla', 'Rivian', 'Lucid Motors', 'Fisker',
  'Ferrari', 'McLaren', 'Aston Martin', 'Lotus', 'Pagani', 'Koenigsegg',
  'Subaru', 'Mazda', 'Isuzu',
  'Bosch', 'Continental', 'ZF Friedrichshafen', 'Denso', 'Magna International',
  'Aptiv', 'Valeo', 'Faurecia', 'Lear Corporation', 'Tenneco', 'Visteon',
];

const COMPANY_SIZES = [
  '1–10 employees',
  '11–50 employees',
  '51–200 employees',
  '201–1,000 employees',
  '1,001–10,000 employees',
  '10,000+ employees',
];

interface ClearbitResult {
  name: string;
  domain: string;
  logo: string;
}

interface Suggestion {
  name: string;
  domain?: string;
  logo?: string;
  isOther?: boolean;
}

interface Props {
  onSubmit: (companyName: string, website?: string, size?: string, country?: string) => void;
}

export function CompanyContextCard({ onSubmit }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [highlighted, setHighlighted] = useState(-1);
  const [loading, setLoading] = useState(false);

  // "Other" expanded form
  const [showOtherForm, setShowOtherForm] = useState(false);
  const [otherName, setOtherName] = useState('');
  const [otherWebsite, setOtherWebsite] = useState('');
  const [otherSize, setOtherSize] = useState('');
  const [otherCountry, setOtherCountry] = useState('');

  const [error, setError] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildSuggestions = useCallback(async (value: string) => {
    const q = value.toLowerCase().trim();
    if (q.length < 2) { setSuggestions([]); return; }

    // 1. Instant local matches
    const local: Suggestion[] = KNOWN_COMPANIES
      .filter(c => c.toLowerCase().includes(q))
      .slice(0, 5)
      .map(name => ({ name }));

    // Show local results immediately
    setSuggestions([...local, { name: 'Other — my company isn\'t listed', isOther: true }]);

    // 2. Fetch Clearbit in background
    setLoading(true);
    try {
      const res = await fetch(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(value)}`
      );
      if (res.ok) {
        const remote: ClearbitResult[] = await res.json();
        // Merge: remote first, skip dupes from local list
        const localNames = new Set(local.map(l => l.name.toLowerCase()));
        const merged: Suggestion[] = [...local];
        for (const r of remote) {
          if (!localNames.has(r.name.toLowerCase())) {
            merged.push({ name: r.name, domain: r.domain, logo: r.logo });
          }
          if (merged.length >= 7) break;
        }
        setSuggestions([...merged, { name: 'Other — my company isn\'t listed', isOther: true }]);
      }
    } catch {
      // keep local results
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setHighlighted(-1);
    setShowOtherForm(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(() => buildSuggestions(value), 280);
  };

  const selectSuggestion = (s: Suggestion) => {
    if (s.isOther) {
      setSuggestions([]);
      setShowOtherForm(true);
      setOtherName(query);
      return;
    }
    setQuery(s.name);
    setSuggestions([]);
    setHighlighted(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, -1)); }
    else if (e.key === 'Enter' && highlighted >= 0) { e.preventDefault(); selectSuggestion(suggestions[highlighted]); }
    else if (e.key === 'Escape') setSuggestions([]);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setSuggestions([]);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = () => {
    if (showOtherForm) {
      if (!otherName.trim()) { setError('Please enter your company name.'); return; }
      setError('');
      onSubmit(otherName.trim(), otherWebsite.trim() || undefined, otherSize || undefined, otherCountry.trim() || undefined);
    } else {
      if (!query.trim()) { setError('Please enter or select your company name.'); return; }
      setError('');
      onSubmit(query.trim());
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">Let's start with your company information:</p>
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">

        {!showOtherForm ? (
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Company Name *</label>
            <div className="relative" ref={wrapperRef}>
              <Building2 size={14} className="absolute left-3 top-3 text-slate-400 z-10" />
              <input
                type="text"
                value={query}
                onChange={e => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search any company worldwide…"
                autoComplete="off"
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
              />
              {loading && (
                <span className="absolute right-3 top-3">
                  <span className="block w-3.5 h-3.5 border-2 border-brand-300 border-t-brand-500 rounded-full animate-spin" />
                </span>
              )}

              {suggestions.length > 0 && (
                <ul className="absolute z-20 top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
                  {suggestions.map((s, i) => (
                    <li
                      key={s.isOther ? '__other__' : (s.domain ?? s.name)}
                      onMouseDown={() => selectSuggestion(s)}
                      className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors border-t border-slate-100 first:border-t-0 ${
                        i === highlighted
                          ? 'bg-brand-50 text-brand-700'
                          : s.isOther
                            ? 'text-slate-500 hover:bg-slate-50 italic'
                            : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {s.isOther ? (
                        <>
                          <ChevronRight size={14} className="text-slate-400 shrink-0" />
                          <span className="text-sm">{s.name}</span>
                        </>
                      ) : s.logo ? (
                        <>
                          <img
                            src={s.logo}
                            alt=""
                            className="w-5 h-5 rounded object-contain shrink-0"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{s.name}</p>
                            {s.domain && <p className="text-[10px] text-slate-400 truncate">{s.domain}</p>}
                          </div>
                        </>
                      ) : (
                        <>
                          <Building2 size={14} className="text-slate-400 shrink-0" />
                          <p className="text-sm font-medium truncate">{s.name}</p>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          // ── "Other" expanded form ───────────────────────────────────────────
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Details</span>
              <button
                onClick={() => { setShowOtherForm(false); setError(''); }}
                className="text-[10px] text-brand-500 hover:underline font-medium"
              >
                ← Back to search
              </button>
            </div>

            {/* Company Name */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest pl-1">Company Name *</label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={otherName}
                  onChange={e => setOtherName(e.target.value)}
                  placeholder="Your company name"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Website */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest pl-1">Website</label>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="url"
                  value={otherWebsite}
                  onChange={e => setOtherWebsite(e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Company Size */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest pl-1">Company Size</label>
              <div className="relative">
                <Users size={14} className="absolute left-3 top-3 text-slate-400" />
                <select
                  value={otherSize}
                  onChange={e => setOtherSize(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium appearance-none text-slate-700"
                >
                  <option value="">Select size…</option>
                  {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Country */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest pl-1">Country / Region</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={otherCountry}
                  onChange={e => setOtherCountry(e.target.value)}
                  placeholder="e.g. India, Germany, USA"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-xs text-rose-500 font-medium px-1">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full py-2.5 bg-brand-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-[0.98] cursor-pointer"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
