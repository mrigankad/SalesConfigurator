import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface Props {
  min?: number;
  max?: number;
  onSubmit: (count: string) => void;
}

export function CountInputCard({ min = 1, max = 20, onSubmit }: Props) {
  const [count, setCount] = useState(min);

  const decrement = () => setCount(prev => Math.max(min, prev - 1));
  const increment = () => setCount(prev => Math.min(max, prev + 1));

  const handleSubmit = () => {
    onSubmit(count.toString());
  };

  return (
    <div className="space-y-3">
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={decrement}
            className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-brand-500 hover:text-brand-500 transition-all cursor-pointer"
          >
            <Minus size={18} />
          </button>
          <div className="w-20 h-14 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-900">{count}</span>
          </div>
          <button
            onClick={increment}
            className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-brand-500 hover:text-brand-500 transition-all cursor-pointer"
          >
            <Plus size={18} />
          </button>
        </div>
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
