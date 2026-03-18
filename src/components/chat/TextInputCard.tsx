import { useState } from 'react';
import { Type } from 'lucide-react';

interface Props {
  placeholder: string;
  onSubmit: (value: string) => void;
}

export function TextInputCard({ placeholder, onSubmit }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!value.trim()) {
      setError('Please enter a value.');
      return;
    }
    setError('');
    onSubmit(value.trim());
  };

  return (
    <div className="space-y-3">
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="relative">
          <Type size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
          />
        </div>
        {error && (
          <p className="text-xs text-rose-500 font-medium px-1">{error}</p>
        )}
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
