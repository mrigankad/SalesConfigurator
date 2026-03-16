import { cn } from '../../lib/cn';
import { DERIVATIVE_OPTIONS } from '../../constants/services';

interface Props {
  onSelect: (num: string) => void;
}

export function DerivativesSelectCard({ onSelect }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {DERIVATIVE_OPTIONS.map((num, i) => (
        <button
          key={num}
          onClick={() => onSelect(num)}
          className={cn(
            "w-full flex items-center justify-between p-3.5 hover:bg-brand-50 transition-all group cursor-pointer",
            i !== DERIVATIVE_OPTIONS.length - 1 && "border-b border-slate-100"
          )}
        >
          <span className="text-sm font-medium text-slate-700">
            {num} Derivative{num !== '1' ? 's' : ''}
          </span>
          <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center group-hover:border-brand-500 transition-colors">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
      ))}
    </div>
  );
}
