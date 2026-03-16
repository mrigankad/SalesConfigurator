import { Box, Package, Layout } from 'lucide-react';
import { BODY_TYPES } from '../../constants/services';

interface Props {
  onSelect: (body: string) => void;
}

const BODY_ICONS: Record<string, React.ReactNode> = {
  'Single Body': <Box size={18} />,
  'Dual Body': <Package size={18} />,
  'Triple Body': <Layout size={18} />,
};

export function BodyTypeSelectCard({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {BODY_TYPES.map((body) => (
        <button
          key={body}
          onClick={() => onSelect(body)}
          className="group flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all hover:translate-x-1 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
            {BODY_ICONS[body]}
          </div>
          <div className="text-left">
            <span className="block text-sm font-bold text-slate-900">{body}</span>
            <span className="block text-[10px] text-slate-400 font-medium">Standard body configuration for {body.split(' ')[0]}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
