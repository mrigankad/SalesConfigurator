import { Zap, Calendar, Hourglass, Clock } from 'lucide-react';
import { TIMELINE_OPTIONS } from '../../constants/services';

interface Props {
  onSelect: (timeline: string) => void;
}

const TIMELINE_ICONS: Record<string, React.ReactNode> = {
  'Urgent': <Zap size={18} className="text-rose-500" />,
  '1-3 months': <Calendar size={18} className="text-amber-500" />,
  '3-6 months': <Clock size={18} className="text-blue-500" />,
  '6+ months': <Hourglass size={18} className="text-emerald-500" />,
};

export function TimelineSelectCard({ onSelect }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {TIMELINE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className="group flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all hover:-translate-y-0.5 text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              {TIMELINE_ICONS[option.value]}
            </div>
            <span className="text-sm font-bold text-slate-900">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
