import { useEffect, useMemo } from 'react';
import { Bot, X, FileText, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';

import { useChat } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ResultsCard } from './ResultsCard';
import { ConfiguratorPanel } from '../configurator/ConfiguratorPanel';
import { useChatStore } from '../../store/chatStore';
import { cn } from '../../lib/cn';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatWindow({ open, onOpenChange }: Props) {
  const {
    messages,
    currentStep,
    userData,
    isTyping,
    messagesEndRef,
    startConversation,
    // STEP 0: Company Context
    handleLeadSubmit,
    handleCompanySubmit,
    handleIndustrySelect,
    handleRoleSelect,
    handleWorkedBeforeSelect,
    handlePreviousProjectsSubmit,
    handleHowHeardSelect,
    handleTimelineSelect,
    // STEP 1: Data Prep
    handleCadProvisionSelect,
    handleCadFormatSelect,
    handleModelHierarchySubmit,
    // STEP 2: Model Definition
    handleUniqueModelsCount,
    handleModelNameSubmit,
    handleUniqueVariantsCount,
    handleSegmentSelect,
    handleUpdateFrequencySelect,
    handleBodyTypeSelect,
    // STEP 3: Configuration Details
    handleTrimLevelsCount,
    handleWheelTypesCount,
    handleExteriorColorsCount,
    handleInteriorOptionsCount,
    handleMarketsSubmit,
    handleCustomizationLevelSelect,
    // STEP 4: Modeling Related
    handleExteriorModelingSelect,
    handleInteriorSoftPartsSelect,
    handleReferenceDataSelect,
    handleCadShapeReferenceSelect,
    handleScanningNeededSelect,
    // STEP 5: Material Related
    handleMaterialSamplesSelect,
    handleTextureSamplesSelect,
    // Other
    handleFreeText,
    resetChat,
  } = useChat();

  // Start conversation when dialog opens
  useEffect(() => {
    if (open && messages.length === 0) {
      startConversation();
    }
  }, [open]);

  // Reset when dialog closes
  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetChat();
    }
    onOpenChange(isOpen);
  };

  const isInputDisabled = currentStep === 'calculating' || currentStep === 'idle';

  // True when the last AI message has an interactive card so we can show the hint
  const hasActiveCard = useMemo(() => {
    const lastMsg = [...messages].reverse().find(m => m.type === 'ai');
    return !!lastMsg?.interactiveType && lastMsg.interactiveType !== 'results';
  }, [messages]);

  // Stage 1: phone/thin — greeting + lead capture
  // Stage 2: medium — questionnaire questions
  // Stage 3: canvas — results (full viewport)
  const isExpanded = useMemo(() => {
    return [
      // STEP 0 (after lead capture)
      'company_context', 'industry_select', 'role_select',
      'worked_before', 'previous_projects', 'how_heard', 'project_timeline',
      // STEP 1
      'cad_provision', 'cad_format_select', 'model_hierarchy',
      // STEP 2
      'unique_models_count', 'model_name', 'unique_variants_count',
      'segment_select', 'update_frequency', 'body_type_select',
      // STEP 3
      'trim_levels', 'wheel_types', 'exterior_colors',
      'interior_options', 'markets', 'customization_level',
      // STEP 4
      'exterior_modeling', 'interior_soft_parts', 'reference_data_provided',
      'cad_shape_reference', 'scanning_needed',
      // STEP 5
      'material_samples', 'texture_samples',
      // Calculating (before canvas opens)
      'calculating',
    ].includes(currentStep);
  }, [currentStep]);

  const isCanvasMode = currentStep === 'results' || currentStep === 'post_results';

  const canvasMode = useChatStore(s => s.canvasMode);
  const setCanvasMode = useChatStore(s => s.setCanvasMode);

  // Progress indicator steps
  const progressSteps = [
    { id: 'lead_capture', label: 'Contact' },
    { id: 'company_context', label: 'Company' },
    { id: 'industry_select', label: 'Industry' },
    { id: 'role_select', label: 'Role' },
    { id: 'worked_before', label: 'History' },
    { id: 'project_timeline', label: 'Timeline' },
    { id: 'cad_provision', label: 'Data Prep' },
    { id: 'unique_models_count', label: 'Models' },
    { id: 'segment_select', label: 'Segment' },
    { id: 'trim_levels', label: 'Config' },
    { id: 'exterior_modeling', label: 'Modeling' },
    { id: 'material_samples', label: 'Materials' },
    { id: 'results', label: 'Results' },
  ];

  const getCurrentStepIndex = () => {
    const stepMap: Record<string, number> = {
      'lead_capture': 0,
      'company_context': 1,
      'industry_select': 2,
      'role_select': 3,
      'worked_before': 4,
      'previous_projects': 4,
      'how_heard': 4,
      'project_timeline': 5,
      'cad_provision': 6,
      'cad_format_select': 6,
      'model_hierarchy': 6,
      'unique_models_count': 7,
      'model_name': 7,
      'unique_variants_count': 7,
      'segment_select': 8,
      'update_frequency': 8,
      'body_type_select': 8,
      'trim_levels': 9,
      'wheel_types': 9,
      'exterior_colors': 9,
      'interior_options': 9,
      'markets': 9,
      'customization_level': 9,
      'exterior_modeling': 10,
      'interior_soft_parts': 10,
      'reference_data_provided': 10,
      'cad_shape_reference': 10,
      'scanning_needed': 10,
      'material_samples': 11,
      'texture_samples': 11,
      'calculating': 12,
      'results': 12,
      'post_results': 12,
    };
    return stepMap[currentStep] ?? 0;
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          />
        </Dialog.Overlay>

        {/* Centered positioning */}
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 focus:outline-none" style={{ padding: isCanvasMode ? '8px' : undefined }}>
          <motion.div
            layout
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative flex flex-col overflow-hidden bg-white/95 rounded-lg border-[6px] border-brand-500/30 backdrop-blur-2xl ring-1 ring-white/60"
            style={{
              width: isCanvasMode ? 'calc(100vw - 16px)' : isExpanded ? 'min(980px, calc(100vw - 32px))' : 'min(400px, calc(100vw - 32px))',
              height: isCanvasMode ? 'calc(100vh - 16px)' : isExpanded ? 'min(860px, calc(100vh - 32px))' : 'min(620px, calc(100vh - 32px))',
              boxShadow: `
                0 40px 80px -20px rgba(0, 85, 137, 0.4), 
                0 0 100px 10px rgba(0, 85, 137, 0.15),
                inset 0 0 20px rgba(255, 255, 255, 0.4)
              `,
              transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Header */}
            <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-lg shrink-0">
                <Bot size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <Dialog.Title className="font-bold text-slate-900 text-base truncate">
                  Dassault Sales Advisor
                </Dialog.Title>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                    AI Sales Assistant
                  </span>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] font-bold text-brand-500 bg-brand-50 px-2 py-0.5 rounded-full uppercase tracking-wider"
                    >
                      Sales Advisor
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Step indicator — bar on desktop, dots on mobile */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 mr-2"
                >
                  {/* Desktop: label + bar */}
                  <div className="hidden sm:flex flex-col items-end gap-1 min-w-[140px]">
                    {(() => {
                      const currentIndex = getCurrentStepIndex();
                      const pct = Math.round((currentIndex / (progressSteps.length - 1)) * 100);
                      const label = progressSteps[currentIndex]?.label ?? '';
                      return (
                        <>
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px] font-semibold text-brand-500 uppercase tracking-wider">
                              {label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {currentIndex + 1}/{progressSteps.length}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-brand-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                            />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  {/* Mobile: compact dots */}
                  <div className="flex sm:hidden items-center gap-1">
                    {progressSteps.map((_, idx) => {
                      const currentIndex = getCurrentStepIndex();
                      return (
                        <motion.div
                          key={idx}
                          className={`rounded-full transition-all duration-300 ${
                            idx < currentIndex
                              ? 'w-1.5 h-1.5 bg-brand-500'
                              : idx === currentIndex
                              ? 'w-2.5 h-1.5 bg-brand-500'
                              : 'w-1.5 h-1.5 bg-slate-200'
                          }`}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              )}

              <Dialog.Close asChild>
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer">
                  <X size={18} />
                </button>
              </Dialog.Close>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">
              {/* Left Column: Chat */}
              <div className={cn(
                "flex flex-col transition-all duration-500 relative",
                isCanvasMode ? "w-[440px] shrink-0 border-r border-slate-200 bg-white" : "flex-1 w-full"
              )}>
                {/* Messages */}
                <ScrollArea.Root className="flex-1 overflow-hidden bg-slate-50/50">
                  <ScrollArea.Viewport className="w-full h-full px-6 py-6">
                    <div className="flex flex-col gap-5 min-h-full pb-4 max-w-4xl mx-auto transition-all duration-500">
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <ChatMessage
                        key={msg.id}
                        msg={msg}
                        userData={userData}
                        // STEP 0: Company Context
                        onLeadSubmit={handleLeadSubmit}
                        onCompanySubmit={handleCompanySubmit}
                        onIndustrySelect={handleIndustrySelect}
                        onRoleSelect={handleRoleSelect}
                        onWorkedBeforeSelect={handleWorkedBeforeSelect}
                        onPreviousProjectsSubmit={handlePreviousProjectsSubmit}
                        onHowHeardSelect={handleHowHeardSelect}
                        onTimelineSelect={handleTimelineSelect}
                        // STEP 1: Data Prep
                        onCadProvisionSelect={handleCadProvisionSelect}
                        onCadFormatSelect={handleCadFormatSelect}
                        onModelHierarchySubmit={handleModelHierarchySubmit}
                        // STEP 2: Model Definition
                        onUniqueModelsCount={handleUniqueModelsCount}
                        onModelNameSubmit={handleModelNameSubmit}
                        onUniqueVariantsCount={handleUniqueVariantsCount}
                        onSegmentSelect={handleSegmentSelect}
                        onUpdateFrequencySelect={handleUpdateFrequencySelect}
                        onBodyTypeSelect={handleBodyTypeSelect}
                        // STEP 3: Configuration Details
                        onTrimLevelsCount={handleTrimLevelsCount}
                        onWheelTypesCount={handleWheelTypesCount}
                        onExteriorColorsCount={handleExteriorColorsCount}
                        onInteriorOptionsCount={handleInteriorOptionsCount}
                        onMarketsSubmit={handleMarketsSubmit}
                        onCustomizationLevelSelect={handleCustomizationLevelSelect}
                        // STEP 4: Modeling Related
                        onExteriorModelingSelect={handleExteriorModelingSelect}
                        onInteriorSoftPartsSelect={handleInteriorSoftPartsSelect}
                        onReferenceDataSelect={handleReferenceDataSelect}
                        onCadShapeReferenceSelect={handleCadShapeReferenceSelect}
                        onScanningNeededSelect={handleScanningNeededSelect}
                        // STEP 5: Material Related
                        onMaterialSamplesSelect={handleMaterialSamplesSelect}
                        onTextureSamplesSelect={handleTextureSamplesSelect}
                      />
                    ))}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 self-start"
                      >
                        <div className="bg-white border border-slate-200 rounded-lg rounded-tl-none px-5 py-3.5 shadow-sm flex items-center gap-2">
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar className="flex select-none touch-none p-0.5 bg-transparent w-2.5" orientation="vertical">
                <ScrollArea.Thumb className="flex-1 bg-slate-300 rounded-full relative" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>

                {/* Input */}
                <div className="shrink-0 max-w-4xl mx-auto w-full transition-all duration-500">
                  <ChatInput onSend={handleFreeText} disabled={isInputDisabled} hasActiveCard={hasActiveCard} />
                </div>
              </div>

              {/* Right Column: Canvas */}
              <AnimatePresence>
                {isCanvasMode && (
                  <motion.div
                    initial={{ flexGrow: 0, width: 0, opacity: 0 }}
                    animate={{ flexGrow: 1, width: 'auto', opacity: 1 }}
                    exit={{ flexGrow: 0, width: 0, opacity: 0 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                    className="flex flex-col flex-1 overflow-hidden bg-slate-50/80"
                  >
                    {/* Toggle tabs */}
                    <div className="shrink-0 flex border-b border-slate-200 bg-white px-4 pt-3 gap-1">
                      <button
                        onClick={() => setCanvasMode('quote')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-xs font-semibold transition-all cursor-pointer ${
                          canvasMode === 'quote'
                            ? 'bg-slate-50 text-brand-600 border border-b-0 border-slate-200'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <FileText size={13} />
                        Quote
                      </button>
                      <button
                        onClick={() => setCanvasMode('configurator')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-xs font-semibold transition-all cursor-pointer ${
                          canvasMode === 'configurator'
                            ? 'bg-slate-50 text-brand-600 border border-b-0 border-slate-200'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Car size={13} />
                        Configure
                      </button>
                    </div>

                    {/* Panel content */}
                    <div className={cn("flex-1 min-h-0", canvasMode === 'quote' ? "overflow-y-auto p-4" : "overflow-hidden")}>
                      <AnimatePresence mode="wait">
                        {canvasMode === 'quote' ? (
                          <motion.div key="quote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <ResultsCard userData={userData} />
                          </motion.div>
                        ) : (
                          <motion.div key="configurator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <ConfiguratorPanel />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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
