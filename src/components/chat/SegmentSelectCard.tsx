import { Car, Truck, Zap, Star } from 'lucide-react';
import { CAR_SEGMENTS } from '../../constants/services';

interface Props {
  onSelect: (segment: string) => void;
}

const SEGMENT_ICONS: Record<string, React.ReactNode> = {
  'Mini': <Zap size={18} />,
  'Small': <Car size={18} />,
  'Midsize': <Car size={18} />,
  'Large': <Truck size={18} />,
  'Very Large': <Truck size={18} />,
  'Luxury': <Star size={18} />,
};

export function SegmentSelectCard({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {CAR_SEGMENTS.map((segment) => (
        <button
          key={segment}
          onClick={() => onSelect(segment)}
          className="group flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all hover:translate-x-1 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            {SEGMENT_ICONS[segment]}
          </div>
          <span className="text-sm font-bold text-slate-900">{segment}</span>
        </button>
      ))}
    </div>
  );
}
