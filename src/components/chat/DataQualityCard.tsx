import { ChevronRight } from 'lucide-react';
import { DATA_QUALITY } from '../../constants/services';

interface Props {
  onSelect: (val: string) => void;
}

export function DataQualityCard({ onSelect }: Props) {
  return (
    <div className="space-y-2">
      {DATA_QUALITY.map((item) => (
        <button
          key={item.value}
          onClick={() => onSelect(item.value)}
          className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all group cursor-pointer"
        >
          <div className="text-left">
            <span className="text-sm font-bold text-slate-900 block">{item.value}</span>
            <span className="text-[10px] text-slate-400">{item.label}</span>
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
        </button>
      ))}
    </div>
  );
}
