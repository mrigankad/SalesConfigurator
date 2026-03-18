import { Gauge, Settings2, SlidersHorizontal } from 'lucide-react';
import { CUSTOMIZATION_LEVELS } from '../../constants/services';

interface Props {
  onSelect: (level: string) => void;
}

const LEVEL_ICONS: Record<string, React.ReactNode> = {
  'Low': <Gauge size={18} className="text-emerald-500" />,
  'Medium': <Settings2 size={18} className="text-amber-500" />,
  'High': <SlidersHorizontal size={18} className="text-rose-500" />,
};

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  'Low': 'Fixed configurations, limited options',
  'Medium': 'Some customization available',
  'High': 'Extensive customization & personalization',
};

export function CustomizationLevelCard({ onSelect }: Props) {
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {CUSTOMIZATION_LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => onSelect(level.value)}
            className="group w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all hover:-translate-y-0.5 text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              {LEVEL_ICONS[level.value]}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">{level.label}</span>
              <span className="text-[10px] text-slate-400">{LEVEL_DESCRIPTIONS[level.value]}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
