import { useState } from 'react';
import { Users, Globe, CalendarDays, Mail, HelpCircle } from 'lucide-react';
import { HOW_HEARD_OPTIONS, PROJECT_GOALS } from '../../constants/services';

interface Props {
  onSelect: (howHeard: string, goal: string) => void;
}

const HOW_HEARD_ICONS: Record<string, React.ReactNode> = {
  'Referral': <Users size={18} />,
  'Website': <Globe size={18} />,
  'Event': <CalendarDays size={18} />,
  'Outreach': <Mail size={18} />,
  'Other': <HelpCircle size={18} />,
};

export function HowHeardCard({ onSelect }: Props) {
  const [selectedHowHeard, setSelectedHowHeard] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    if (selectedHowHeard) {
      onSelect(selectedHowHeard, goal);
    }
  };

  const handleHowHeardSelect = (howHeard: string) => {
    setSelectedHowHeard(howHeard);
    if (selectedGoal) {
      onSelect(howHeard, selectedGoal);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">How did you hear about us?</p>
        <div className="grid grid-cols-3 gap-2">
          {HOW_HEARD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleHowHeardSelect(option.value)}
              className={`group flex flex-col items-center justify-center p-2 border rounded-lg transition-all hover:-translate-y-0.5 text-center cursor-pointer ${
                selectedHowHeard === option.value
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-200 bg-white hover:border-brand-500 hover:bg-brand-50'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                {HOW_HEARD_ICONS[option.value]}
              </div>
              <span className="text-[10px] font-bold text-slate-900">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">What is your primary goal?</p>
        <div className="grid grid-cols-2 gap-2">
          {PROJECT_GOALS.map((goal) => (
            <button
              key={goal.value}
              onClick={() => handleGoalSelect(goal.value)}
              className={`group py-2 px-3 border rounded-lg transition-all hover:-translate-y-0.5 text-center cursor-pointer ${
                selectedGoal === goal.value
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-200 bg-white hover:border-brand-500 hover:bg-brand-50'
              }`}
            >
              <span className="text-xs font-bold text-slate-900">{goal.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
