import { RefreshCw, Calendar, Clock, Hourglass, MoreHorizontal } from 'lucide-react';
import { UPDATE_FREQUENCIES } from '../../constants/services';

interface Props {
  onSelect: (frequency: string) => void;
}

const FREQUENCY_ICONS: Record<string, React.ReactNode> = {
  'Annually': <Calendar size={18} />,
  'Bi-annually': <RefreshCw size={18} />,
  'Every 3 years': <Clock size={18} />,
  'Every 5 years': <Hourglass size={18} />,
  'Other': <MoreHorizontal size={18} />,
};

export function UpdateFrequencyCard({ onSelect }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {UPDATE_FREQUENCIES.map((freq) => (
          <button
            key={freq.value}
            onClick={() => onSelect(freq.value)}
            className="group flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all hover:-translate-y-0.5 text-center cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              {FREQUENCY_ICONS[freq.value]}
            </div>
            <span className="text-[10px] font-bold text-slate-900">{freq.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
