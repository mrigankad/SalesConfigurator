import { useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, CheckCircle2, Calendar, Clock } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ALL_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

function formatSlot(slot: string): string {
  const [hStr, mStr] = slot.split(':');
  const h = parseInt(hStr, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${mStr} ${suffix}`;
}

/** Deterministic pseudo-random based on date string — marks ~30% slots unavailable */
function unavailableSlots(date: Date): Set<string> {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const unavailable = new Set<string>();
  ALL_SLOTS.forEach((slot, i) => {
    const hash = (seed * 31 + i * 17 + slot.charCodeAt(0) * 7) % 100;
    if (hash < 30) unavailable.add(slot);
  });
  return unavailable;
}

// ── Date helpers ─────────────────────────────────────────────────────────────

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

/** Returns Mon-anchored day-of-week: Mon=0 … Sun=6 */
function mondayDow(d: Date): number {
  return (d.getDay() + 6) % 7;
}

function isWeekend(d: Date): boolean {
  const dow = d.getDay(); // 0=Sun, 6=Sat
  return dow === 0 || dow === 6;
}

function formatDayLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatConfirmDay(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface CalendarStageProps {
  selected: Date | null;
  onSelect: (d: Date) => void;
}

function CalendarStage({ selected, onSelect }: CalendarStageProps) {
  const today = startOfDay(new Date());
  const minDate = addDays(today, 1);
  const maxDate = addDays(today, 60);

  const [viewYear, setViewYear] = useState(() => minDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => minDate.getMonth());

  const monthStart = useMemo(() => new Date(viewYear, viewMonth, 1), [viewYear, viewMonth]);
  const monthEnd = useMemo(() => new Date(viewYear, viewMonth + 1, 0), [viewYear, viewMonth]);

  // Leading empty cells so the grid starts on Monday
  const leadingBlanks = mondayDow(monthStart);

  // All days in this month
  const days = useMemo(() => {
    const arr: Date[] = [];
    for (let d = 1; d <= monthEnd.getDate(); d++) {
      arr.push(new Date(viewYear, viewMonth, d));
    }
    return arr;
  }, [viewYear, viewMonth, monthEnd]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Disable prev if this month is already the min month
  const canGoPrev = !(viewYear === minDate.getFullYear() && viewMonth === minDate.getMonth());
  // Disable next if this month is already the max month
  const maxMonth = new Date(viewYear, viewMonth + 1, 0);
  const canGoNext = maxMonth <= maxDate || !(viewYear === maxDate.getFullYear() && viewMonth === maxDate.getMonth());

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold text-slate-900">{monthLabel}</span>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map(h => (
          <div key={h} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1">
            {h}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* Leading blanks */}
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {days.map(day => {
          const disabled = day < minDate || day > maxDate || isWeekend(day);
          const isToday = sameDay(day, today);
          const isSelected = selected ? sameDay(day, selected) : false;

          let cellClass =
            'h-8 w-full flex items-center justify-center rounded-lg text-xs font-semibold transition-all ';

          if (isSelected) {
            cellClass += 'bg-brand-500 text-white shadow-sm';
          } else if (disabled) {
            cellClass += 'text-slate-300 cursor-not-allowed';
          } else if (isToday) {
            cellClass += 'border border-brand-300 text-brand-600 hover:bg-brand-50 cursor-pointer';
          } else {
            cellClass += 'text-slate-700 hover:bg-slate-100 cursor-pointer';
          }

          return (
            <button
              key={day.toISOString()}
              disabled={disabled}
              onClick={() => !disabled && onSelect(day)}
              className={cellClass}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface TimeStageProps {
  date: Date;
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
  onBack: () => void;
}

function TimeStage({ date, selectedSlot, onSelect, onBack }: TimeStageProps) {
  const unavailable = useMemo(() => unavailableSlots(date), [date]);

  return (
    <div>
      {/* Selected date header */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
        <Calendar size={14} className="text-brand-500 shrink-0" />
        <span className="text-xs font-semibold text-slate-700">{formatDayLabel(date)}</span>
      </div>

      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Select a time</p>

      <div className="grid grid-cols-3 gap-2">
        {ALL_SLOTS.map(slot => {
          const isUnavailable = unavailable.has(slot);
          const isSelected = slot === selectedSlot;

          let cls =
            'py-2 px-1 rounded-lg text-xs font-semibold text-center transition-all ';

          if (isSelected) {
            cls += 'bg-brand-500 text-white shadow-sm';
          } else if (isUnavailable) {
            cls += 'bg-slate-100 text-slate-300 cursor-not-allowed text-[10px]';
          } else {
            cls += 'bg-white border border-slate-200 text-slate-700 hover:border-brand-400 hover:text-brand-600 cursor-pointer';
          }

          return (
            <button
              key={slot}
              disabled={isUnavailable}
              onClick={() => !isUnavailable && onSelect(slot)}
              className={cls}
            >
              {isUnavailable ? (
                <span className="text-[9px]">Unavailable</span>
              ) : (
                formatSlot(slot)
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={onBack}
        className="mt-4 flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
      >
        <ChevronLeft size={13} /> Back
      </button>
    </div>
  );
}

interface ConfirmStageProps {
  date: Date;
  slot: string;
  userEmail?: string;
  onClose: () => void;
}

function ConfirmStage({ date, slot, userEmail, onClose }: ConfirmStageProps) {
  return (
    <div className="flex flex-col items-center text-center py-4">
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mb-4"
      >
        <CheckCircle2 size={36} className="text-emerald-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <h3 className="text-base font-black text-slate-900">Call Booked!</h3>
        <p className="text-sm font-semibold text-slate-700">
          Your call is booked for{' '}
          <span className="text-brand-600">{formatConfirmDay(date)}</span>{' '}
          at{' '}
          <span className="text-brand-600">{formatSlot(slot)}</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-4 space-y-2 w-full"
      >
        {userEmail && (
          <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3 text-left">
            <Calendar size={13} className="text-brand-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-slate-600">
              A calendar invite will be sent to{' '}
              <span className="font-semibold text-slate-800">{userEmail}</span>
            </p>
          </div>
        )}
        <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3 text-left">
          <Clock size={13} className="text-brand-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-slate-600">
            Our sales team will call you at the number provided
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 w-full"
      >
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-brand-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-brand-600 transition-all"
        >
          Done
        </button>
      </motion.div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Stage = 'date' | 'time' | 'confirm';

export function BookingModal({ open, onClose, userEmail }: Props) {
  const [stage, setStage] = useState<Stage>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  function handleClose() {
    onClose();
    // Delay reset so animation plays out
    setTimeout(() => {
      setStage('date');
      setSelectedDate(null);
      setSelectedSlot(null);
    }, 300);
  }

  function handleDateSelect(d: Date) {
    setSelectedDate(d);
    setSelectedSlot(null);
    setStage('time');
  }

  function handleSlotSelect(slot: string) {
    setSelectedSlot(slot);
    setStage('confirm');
  }

  const STAGE_TITLES: Record<Stage, string> = {
    date: 'Pick a Date',
    time: 'Pick a Time',
    confirm: 'Booking Confirmed',
  };

  return (
    <Dialog.Root open={open} onOpenChange={v => { if (!v) handleClose(); }}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
        </Dialog.Overlay>

        {/* Panel */}
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-500">
                  <Calendar size={14} />
                </div>
                <span className="text-sm font-bold text-slate-900">{STAGE_TITLES[stage]}</span>
              </div>
              <Dialog.Close asChild>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X size={15} />
                </button>
              </Dialog.Close>
            </div>

            {/* Stage indicator */}
            <div className="flex gap-1 px-5 pt-3">
              {(['date', 'time', 'confirm'] as Stage[]).map((s, i) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    i <= (['date', 'time', 'confirm'] as Stage[]).indexOf(stage)
                      ? 'bg-brand-500'
                      : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              <AnimatePresence mode="wait">
                {stage === 'date' && (
                  <motion.div
                    key="date"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CalendarStage
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                    />
                  </motion.div>
                )}

                {stage === 'time' && selectedDate && (
                  <motion.div
                    key="time"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TimeStage
                      date={selectedDate}
                      selectedSlot={selectedSlot}
                      onSelect={handleSlotSelect}
                      onBack={() => setStage('date')}
                    />
                  </motion.div>
                )}

                {stage === 'confirm' && selectedDate && selectedSlot && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ConfirmStage
                      date={selectedDate}
                      slot={selectedSlot}
                      userEmail={userEmail}
                      onClose={handleClose}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
