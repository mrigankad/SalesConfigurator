import { FileCheck, FileX } from 'lucide-react';
import { YES_NO_OPTIONS } from '../../constants/services';

interface Props {
  onSelect: (answer: string) => void;
}

const OPTION_ICONS: Record<string, React.ReactNode> = {
  'Yes': <FileCheck size={24} className="text-emerald-500" />,
  'No': <FileX size={24} className="text-rose-500" />,
};

export function CadProvisionCard({ onSelect }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        {YES_NO_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className="group flex-1 flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all hover:-translate-y-0.5 text-center cursor-pointer"
          >
            <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              {OPTION_ICONS[option.value]}
            </div>
            <span className="text-sm font-bold text-slate-900">{option.label}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-2">⚠️ This is a required confirmation. Project cannot proceed without CAD data.</p>
    </div>
  );
}
