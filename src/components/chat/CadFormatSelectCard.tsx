import { FileCode, FileType, Database, Share2, HelpCircle } from 'lucide-react';
import { CAD_FORMATS } from '../../constants/services';

interface Props {
  onSelect: (format: string) => void;
}

const FORMAT_ICONS: Record<string, React.ReactNode> = {
  CATIA: <FileCode size={18} />,
  STEP: <FileType size={18} />,
  JT: <Database size={18} />,
  Parasolid: <Share2 size={18} />,
  Other: <HelpCircle size={18} />,
};

export function CadFormatSelectCard({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {CAD_FORMATS.map((format) => (
        <button
          key={format}
          onClick={() => onSelect(format)}
          className="group flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all hover:-translate-y-0.5 text-center cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            {FORMAT_ICONS[format]}
          </div>
          <span className="text-sm font-bold text-slate-900">{format}</span>
        </button>
      ))}
    </div>
  );
}
