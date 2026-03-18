import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import type { Message, UserData } from '../../types';

// STEP 0: Company Context
import { LeadCaptureCard } from './LeadCaptureCard';
import { CompanyContextCard } from './CompanyContextCard';
import { IndustrySelectCard } from './IndustrySelectCard';
import { RoleSelectCard } from './RoleSelectCard';
import { WorkedBeforeCard } from './WorkedBeforeCard';
import { PreviousProjectsCard } from './PreviousProjectsCard';
import { HowHeardCard } from './HowHeardCard';
import { TimelineSelectCard } from './TimelineSelectCard';

// STEP 1: Data Prep
import { CadProvisionCard } from './CadProvisionCard';
import { CadFormatSelectCard } from './CadFormatSelectCard';
import { ModelHierarchyCard } from './ModelHierarchyCard';

// STEP 2: Model Definition
import { CountInputCard } from './CountInputCard';
import { TextInputCard } from './TextInputCard';
import { SegmentSelectCard } from './SegmentSelectCard';
import { UpdateFrequencyCard } from './UpdateFrequencyCard';
import { BodyTypeSelectCard } from './BodyTypeSelectCard';

// STEP 3: Configuration Details
import { MarketsCard } from './MarketsCard';
import { CustomizationLevelCard } from './CustomizationLevelCard';

// STEP 4 & 5: Yes/No cards
import { YesNoCard } from './YesNoCard';

// Results
import { ResultsCard } from './ResultsCard';

interface Props {
  msg: Message;
  userData: UserData;
  // STEP 0: Company Context
  onLeadSubmit: (name: string, email: string, phone: string) => void;
  onCompanySubmit: (companyName: string, website?: string, size?: string, country?: string) => void;
  onIndustrySelect: (industry: string) => void;
  onRoleSelect: (role: string) => void;
  onWorkedBeforeSelect: (answer: string) => void;
  onPreviousProjectsSubmit: (projects: string, lastEngagement: string) => void;
  onHowHeardSelect: (howHeard: string, goal: string) => void;
  onTimelineSelect: (timeline: string) => void;
  // STEP 1: Data Prep
  onCadProvisionSelect: (answer: string) => void;
  onCadFormatSelect: (format: string) => void;
  onModelHierarchySubmit: (hierarchy: string[]) => void;
  // STEP 2: Model Definition
  onUniqueModelsCount: (count: string) => void;
  onModelNameSubmit: (name: string) => void;
  onUniqueVariantsCount: (count: string) => void;
  onSegmentSelect: (segment: string) => void;
  onUpdateFrequencySelect: (frequency: string) => void;
  onBodyTypeSelect: (body: string) => void;
  // STEP 3: Configuration Details
  onTrimLevelsCount: (count: string) => void;
  onWheelTypesCount: (count: string) => void;
  onExteriorColorsCount: (count: string) => void;
  onInteriorOptionsCount: (count: string) => void;
  onMarketsSubmit: (markets: string[]) => void;
  onCustomizationLevelSelect: (level: string) => void;
  // STEP 4: Modeling Related
  onExteriorModelingSelect: (answer: string) => void;
  onInteriorSoftPartsSelect: (answer: string) => void;
  onReferenceDataSelect: (answer: string) => void;
  onCadShapeReferenceSelect: (answer: string) => void;
  onScanningNeededSelect: (answer: string) => void;
  // STEP 5: Material Related
  onMaterialSamplesSelect: (answer: string) => void;
  onTextureSamplesSelect: (answer: string) => void;
}

export function ChatMessage({
  msg,
  userData,
  // STEP 0
  onLeadSubmit,
  onCompanySubmit,
  onIndustrySelect,
  onRoleSelect,
  onWorkedBeforeSelect,
  onPreviousProjectsSubmit,
  onHowHeardSelect,
  onTimelineSelect,
  // STEP 1
  onCadProvisionSelect,
  onCadFormatSelect,
  onModelHierarchySubmit,
  // STEP 2
  onUniqueModelsCount,
  onModelNameSubmit,
  onUniqueVariantsCount,
  onSegmentSelect,
  onUpdateFrequencySelect,
  onBodyTypeSelect,
  // STEP 3
  onTrimLevelsCount,
  onWheelTypesCount,
  onExteriorColorsCount,
  onInteriorOptionsCount,
  onMarketsSubmit,
  onCustomizationLevelSelect,
  // STEP 4
  onExteriorModelingSelect,
  onInteriorSoftPartsSelect,
  onReferenceDataSelect,
  onCadShapeReferenceSelect,
  onScanningNeededSelect,
  // STEP 5
  onMaterialSamplesSelect,
  onTextureSamplesSelect,
}: Props) {
  if (msg.interactiveType === 'results') {
    return null;
  }

  const isAi = msg.type === 'ai';
  const hasInteractive = !!msg.interactiveType;

  const renderInteractiveCard = () => {
    switch (msg.interactiveType) {
      // STEP 0: Company Context
      case 'lead_capture':
        return <LeadCaptureCard onSubmit={onLeadSubmit} />;
      case 'company_context':
        return <CompanyContextCard onSubmit={onCompanySubmit} />;
      case 'industry_select':
        return <IndustrySelectCard onSelect={onIndustrySelect} />;
      case 'role_select':
        return <RoleSelectCard onSelect={onRoleSelect} />;
      case 'worked_before':
        return <WorkedBeforeCard onSelect={onWorkedBeforeSelect} />;
      case 'previous_projects':
        return <PreviousProjectsCard onSubmit={onPreviousProjectsSubmit} />;
      case 'how_heard':
        return <HowHeardCard onSelect={onHowHeardSelect} />;
      case 'project_timeline':
        return <TimelineSelectCard onSelect={onTimelineSelect} />;

      // STEP 1: Data Prep
      case 'cad_provision':
        return <CadProvisionCard onSelect={onCadProvisionSelect} />;
      case 'cad_format_select':
        return <CadFormatSelectCard onSelect={onCadFormatSelect} />;
      case 'model_hierarchy':
        return <ModelHierarchyCard onSubmit={onModelHierarchySubmit} />;

      // STEP 2: Model Definition
      case 'unique_models_count':
        return <CountInputCard min={1} max={50} onSubmit={onUniqueModelsCount} />;
      case 'model_name':
        return <TextInputCard placeholder="e.g. Model S, Mustang, Corolla..." onSubmit={onModelNameSubmit} />;
      case 'unique_variants_count':
        return <CountInputCard min={1} max={20} onSubmit={onUniqueVariantsCount} />;
      case 'segment_select':
        return <SegmentSelectCard onSelect={onSegmentSelect} />;
      case 'update_frequency':
        return <UpdateFrequencyCard onSelect={onUpdateFrequencySelect} />;
      case 'body_type_select':
        return <BodyTypeSelectCard onSelect={onBodyTypeSelect} />;

      // STEP 3: Configuration Details
      case 'trim_levels':
        return <CountInputCard min={1} max={10} onSubmit={onTrimLevelsCount} />;
      case 'wheel_types':
        return <CountInputCard min={1} max={20} onSubmit={onWheelTypesCount} />;
      case 'exterior_colors':
        return <CountInputCard min={1} max={50} onSubmit={onExteriorColorsCount} />;
      case 'interior_options':
        return <CountInputCard min={1} max={30} onSubmit={onInteriorOptionsCount} />;
      case 'markets':
        return <MarketsCard onSubmit={onMarketsSubmit} />;
      case 'customization_level':
        return <CustomizationLevelCard onSelect={onCustomizationLevelSelect} />;

      // STEP 4: Modeling Related
      case 'exterior_modeling':
        return <YesNoCard onSelect={onExteriorModelingSelect} />;
      case 'interior_soft_parts':
        return <YesNoCard onSelect={onInteriorSoftPartsSelect} />;
      case 'reference_data_provided':
        return <YesNoCard onSelect={onReferenceDataSelect} />;
      case 'cad_shape_reference':
        return <YesNoCard onSelect={onCadShapeReferenceSelect} />;
      case 'scanning_needed':
        return <YesNoCard onSelect={onScanningNeededSelect} />;

      // STEP 5: Material Related
      case 'material_samples':
        return <YesNoCard onSelect={onMaterialSamplesSelect} />;
      case 'texture_samples':
        return <YesNoCard onSelect={onTextureSamplesSelect} />;

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
