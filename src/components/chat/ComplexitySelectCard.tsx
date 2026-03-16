import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { COMPLEXITY_LEVELS } from '../../constants/services';

interface Props {
  onSelect: (complexity: string) => void;
}

export function ComplexitySelectCard({ onSelect }: Props) {
  return (
    <div className="space-y-2">
      {COMPLEXITY_LEVELS.map((lvl) => (
        <button
          key={lvl.value}
          onClick={() => onSelect(lvl.value)}
          className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className={cn("w-2.5 h-2.5 rounded-full", lvl.color)} />
            <div className="text-left">
              <span className="text-sm font-bold text-slate-900 block">{lvl.value}</span>
              <span className="text-[10px] text-slate-400">{lvl.label}</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
        </button>
      ))}
    </div>
  );
}
