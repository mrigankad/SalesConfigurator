import { Car, Factory, Package, Briefcase } from 'lucide-react';
import { INDUSTRIES } from '../../constants/services';

interface Props {
  onSelect: (industry: string) => void;
}

const INDUSTRY_ICONS: Record<string, React.ReactNode> = {
  'Automotive': <Car size={18} />,
  'OEM': <Factory size={18} />,
  'Supplier': <Package size={18} />,
  'Other': <Briefcase size={18} />,
};

export function IndustrySelectCard({ onSelect }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {INDUSTRIES.map((industry) => (
          <button
            key={industry.value}
            onClick={() => onSelect(industry.value)}
            className="group flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all hover:-translate-y-0.5 text-center cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              {INDUSTRY_ICONS[industry.value]}
            </div>
            <span className="text-xs font-bold text-slate-900">{industry.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
