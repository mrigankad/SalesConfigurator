import { Bot, Globe, Layers, Settings } from 'lucide-react';
import { MODEL_TYPES } from '../../constants/services';

interface Props {
  onSelect: (type: string) => void;
}

const MODEL_ICONS: Record<string, React.ReactNode> = {
  NEW: <Globe size={18} />,
  FL: <Layers size={18} />,
  MYC: <Settings size={18} />,
  SE: <Bot size={18} />,
  DRV: <Bot size={18} />,
  BT: <Bot size={18} />,
};

const MODEL_LABELS: Record<string, string> = {
  NEW: 'New Model',
  FL: 'Facelift',
  MYC: 'Mid-Year Change',
  SE: 'Special Edition',
  DRV: 'Derivative',
  BT: 'Body Type',
};

export function ModelSelectCard({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {MODEL_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className="group flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all hover:-translate-y-0.5 text-center cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            {MODEL_ICONS[type]}
          </div>
          <span className="text-[11px] font-bold text-slate-900 leading-tight">{type}</span>
          <span className="text-[8px] text-slate-400 leading-tight mt-0.5">{MODEL_LABELS[type]}</span>
        </button>
      ))}
    </div>
  );
}
