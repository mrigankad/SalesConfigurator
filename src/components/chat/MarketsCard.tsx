import { useState } from 'react';
import { Globe2, Globe, Flag, MapPin, Check } from 'lucide-react';

interface Props {
  onSubmit: (markets: string[]) => void;
}

const MARKET_OPTIONS = [
  { value: 'North America', label: 'North America', icon: <Globe size={16} /> },
  { value: 'Europe', label: 'Europe', icon: <Globe2 size={16} /> },
  { value: 'Asia Pacific', label: 'Asia Pacific', icon: <MapPin size={16} /> },
  { value: 'Latin America', label: 'Latin America', icon: <Flag size={16} /> },
  { value: 'Middle East', label: 'Middle East', icon: <Globe size={16} /> },
  { value: 'Africa', label: 'Africa', icon: <Globe size={16} /> },
];

export function MarketsCard({ onSubmit }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (value: string) => {
    setSelected(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = () => {
    if (selected.length > 0) {
      onSubmit(selected);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">In which geographical markets will this model be available?</p>
      <div className="grid grid-cols-2 gap-2">
        {MARKET_OPTIONS.map((market) => (
          <button
            key={market.value}
            onClick={() => toggleSelection(market.value)}
            className={`group flex items-center gap-2 p-2.5 border rounded-lg transition-all text-left cursor-pointer ${
              selected.includes(market.value)
                ? 'border-brand-500 bg-brand-50'
                : 'border-slate-200 bg-white hover:border-brand-500 hover:bg-brand-50'
            }`}
          >
            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
              selected.includes(market.value) ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-500'
            }`}>
              {selected.includes(market.value) ? <Check size={14} /> : market.icon}
            </div>
            <span className="text-xs font-bold text-slate-900">{market.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selected.length === 0}
        className="w-full py-2.5 bg-brand-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </div>
  );
}
