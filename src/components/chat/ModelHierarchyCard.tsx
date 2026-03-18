import { useState } from 'react';
import { Car, Layers, Settings, Palette, MoreHorizontal, Check } from 'lucide-react';
import { MODEL_HIERARCHY_OPTIONS } from '../../constants/services';

interface Props {
  onSubmit: (hierarchy: string[]) => void;
}

const HIERARCHY_ICONS: Record<string, React.ReactNode> = {
  'Model': <Car size={16} />,
  'Variant': <Layers size={16} />,
  'Drivetrain': <Settings size={16} />,
  'Trim': <Palette size={16} />,
  'Other': <MoreHorizontal size={16} />,
};

export function ModelHierarchyCard({ onSubmit }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (value: string) => {
    setSelected(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = () => {
    if (selected.length > 0) {
      onSubmit(selected);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {MODEL_HIERARCHY_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleSelection(option.value)}
            className={`group flex items-center gap-2 p-2.5 border rounded-lg transition-all text-left cursor-pointer ${
              selected.includes(option.value)
                ? 'border-brand-500 bg-brand-50'
                : 'border-slate-200 bg-white hover:border-brand-500 hover:bg-brand-50'
            }`}
          >
            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
              selected.includes(option.value) ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-500'
            }`}>
              {selected.includes(option.value) ? <Check size={14} /> : HIERARCHY_ICONS[option.value]}
            </div>
            <span className="text-xs font-bold text-slate-900">{option.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selected.length === 0}
        className="w-full py-2.5 bg-brand-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </div>
  );
}
