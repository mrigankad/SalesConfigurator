import { useState } from 'react';
import { Send } from 'lucide-react';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
  hasActiveCard?: boolean;
}

export function ChatInput({ onSend, disabled, hasActiveCard }: Props) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
  };

  return (
    <footer className="bg-white border-t border-slate-100 px-6 py-4">
      {hasActiveCard && (
        <p className="text-[10px] text-slate-400 font-medium text-center mb-2 uppercase tracking-wider">
          or type your answer below
        </p>
      )}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={hasActiveCard ? 'Type your answer…' : 'Type a message…'}
          disabled={disabled}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pr-12 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all placeholder:text-slate-400 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="absolute right-2 top-1.5 w-9 h-9 flex items-center justify-center rounded-lg bg-brand-500 text-white shadow-md active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer"
        >
          <Send size={18} />
        </button>
      </div>
    </footer>
  );
}
