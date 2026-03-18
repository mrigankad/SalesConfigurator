import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { WORKED_BEFORE_OPTIONS } from '../../constants/services';

interface Props {
  onSelect: (answer: string) => void;
}

const OPTION_ICONS: Record<string, React.ReactNode> = {
  'Yes': <CheckCircle2 size={20} className="text-emerald-500" />,
  'No': <XCircle size={20} className="text-rose-500" />,
  'Not Sure': <HelpCircle size={20} className="text-amber-500" />,
};

export function WorkedBeforeCard({ onSelect }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {WORKED_BEFORE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className="group flex-1 flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all hover:-translate-y-0.5 text-center cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              {OPTION_ICONS[option.value]}
            </div>
            <span className="text-sm font-bold text-slate-900">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
