import { UserCog, Wrench, Palette, ShoppingCart, HelpCircle } from 'lucide-react';
import { ROLES } from '../../constants/services';

interface Props {
  onSelect: (role: string) => void;
}

const ROLE_ICONS: Record<string, React.ReactNode> = {
  'Sales': <UserCog size={18} />,
  'Engineering': <Wrench size={18} />,
  'Design': <Palette size={18} />,
  'Procurement': <ShoppingCart size={18} />,
  'Other': <HelpCircle size={18} />,
};

export function RoleSelectCard({ onSelect }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {ROLES.map((role) => (
          <button
            key={role.value}
            onClick={() => onSelect(role.value)}
            className="group flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:bg-brand-50 transition-all hover:-translate-y-0.5 text-center cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              {ROLE_ICONS[role.value]}
            </div>
            <span className="text-[10px] font-bold text-slate-900">{role.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
