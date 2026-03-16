import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import type { Message, UserData } from '../../types';

// Interactive cards
import { LeadCaptureCard } from './LeadCaptureCard';
import { ModelSelectCard } from './ModelSelectCard';
import { CadFormatSelectCard } from './CadFormatSelectCard';
import { SegmentSelectCard } from './SegmentSelectCard';
import { BodyTypeSelectCard } from './BodyTypeSelectCard';
import { ComplexitySelectCard } from './ComplexitySelectCard';
import { DerivativesSelectCard } from './DerivativesSelectCard';
import { MaterialComplexityCard } from './MaterialComplexityCard';
import { DataQualityCard } from './DataQualityCard';
import { CapabilityCard } from './CapabilityCard';
import { ResultsCard } from './ResultsCard';

interface Props {
  msg: Message;
  userData: UserData;
  onLeadSubmit: (name: string, email: string, phone: string) => void;
  onModelSelect: (type: string) => void;
  onCadFormatSelect: (val: string) => void;
  onSegmentSelect: (val: string) => void;
  onBodyTypeSelect: (val: string) => void;
  onComplexitySelect: (complexity: string) => void;
  onDerivativesSelect: (num: string) => void;
  onMaterialSelect: (val: string) => void;
  onDataQualitySelect: (val: string) => void;
  onCapabilitySelect: (val: string) => void;
}

export function ChatMessage({
  msg,
  userData,
  onLeadSubmit,
  onModelSelect,
  onCadFormatSelect,
  onSegmentSelect,
  onBodyTypeSelect,
  onComplexitySelect,
  onDerivativesSelect,
  onMaterialSelect,
  onDataQualitySelect,
  onCapabilitySelect,
}: Props) {
  if (msg.interactiveType === 'results') {
    return null;
  }

  const isAi = msg.type === 'ai';
  const hasInteractive = !!msg.interactiveType;

  const renderInteractiveCard = () => {
    switch (msg.interactiveType) {
      case 'lead_capture':
        return <LeadCaptureCard onSubmit={onLeadSubmit} />;
      case 'model_select':
        return <ModelSelectCard onSelect={onModelSelect} />;
      case 'cad_format_select':
        return <CadFormatSelectCard onSelect={onCadFormatSelect} />;
      case 'segment_select':
        return <SegmentSelectCard onSelect={onSegmentSelect} />;
      case 'body_type_select':
        return <BodyTypeSelectCard onSelect={onBodyTypeSelect} />;
      case 'complexity_select':
        return <ComplexitySelectCard onSelect={onComplexitySelect} />;
      case 'derivatives_select':
        return <DerivativesSelectCard onSelect={onDerivativesSelect} />;
      case 'material_complexity_select':
        return <MaterialComplexityCard onSelect={onMaterialSelect} />;
      case 'data_quality_select':
        return <DataQualityCard onSelect={onDataQualitySelect} />;
      case 'capability_select':
        return <CapabilityCard onSelect={onCapabilitySelect} />;
      case 'results':
        return <ResultsCard userData={userData} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-2 w-full",
        isAi
          ? hasInteractive ? "max-w-full self-start" : "max-w-[85%] self-start"
          : "max-w-[75%] self-end ml-auto"
      )}
    >
      <div className={cn(
        "rounded-lg px-5 py-4 text-sm w-full",
        isAi
          ? "bg-white border border-slate-200 text-slate-900 rounded-tl-none shadow-sm"
          : "bg-brand-500 text-white rounded-tr-none shadow-lg shadow-brand-500/20"
      )}>
        {hasInteractive ? (
          renderInteractiveCard()
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
            {typeof msg.content === 'string' ? msg.content : msg.content}
          </p>
        )}
        <p className={cn(
          "text-[9px] mt-2 font-bold uppercase tracking-wider opacity-50",
          isAi ? "text-slate-400" : "text-white/70"
        )}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}
