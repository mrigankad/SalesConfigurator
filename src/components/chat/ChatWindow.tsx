import { useEffect, useMemo } from 'react';
import { Bot, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';

import { useChat } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ResultsCard } from './ResultsCard';
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
    handleLeadSubmit,
    handleModelSelect,
    handleCadFormatSelect,
    handleSegmentSelect,
    handleBodyTypeSelect,
    handleComplexitySelect,
    handleDerivativesSelect,
    handleMaterialSelect,
    handleDataQualitySelect,
    handleCapabilitySelect,
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

  // Determine widget size based on current step
  const isExpanded = useMemo(() => {
    return [
      'model_select', 
      'cad_format_select',
      'segment_select',
      'body_type_select',
      'complexity_select', 
      'derivatives_select', 
      'material_complexity_select', 
      'data_quality_select', 
      'capability_select', 
      'calculating', 
      'results', 
      'post_results'
    ].includes(currentStep);
  }, [currentStep]);

  const isCanvasMode = currentStep === 'results' || currentStep === 'post_results';

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
              width: isCanvasMode ? 'calc(100vw - 16px)' : isExpanded ? 'min(980px, calc(100vw - 32px))' : 'min(460px, calc(100vw - 32px))',
              height: isCanvasMode ? 'calc(100vh - 16px)' : isExpanded ? 'min(860px, calc(100vh - 32px))' : 'min(700px, calc(100vh - 32px))',
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
                  Dassault Helper
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
                      Configuring
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Step indicator */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hidden sm:flex items-center gap-1.5 mr-2"
                >
                  {[
                    'lead_capture', 
                    'model_select', 
                    'cad_format_select',
                    'segment_select',
                    'body_type_select',
                    'complexity_select', 
                    'derivatives_select', 
                    'material_complexity_select', 
                    'data_quality_select', 
                    'capability_select', 
                    'results'
                  ].map((step, i) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        [
                          'lead_capture', 
                          'model_select', 
                          'cad_format_select',
                          'segment_select',
                          'body_type_select',
                          'complexity_select', 
                          'derivatives_select', 
                          'material_complexity_select', 
                          'data_quality_select', 
                          'capability_select', 
                          'calculating', 
                          'results', 
                          'post_results'
                        ].indexOf(currentStep) >= i
                          ? 'bg-brand-500 scale-100'
                          : 'bg-slate-200 scale-75'
                      }`}
                    />
                  ))}
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
                        onLeadSubmit={handleLeadSubmit}
                        onModelSelect={handleModelSelect}
                        onCadFormatSelect={handleCadFormatSelect}
                        onSegmentSelect={handleSegmentSelect}
                        onBodyTypeSelect={handleBodyTypeSelect}
                        onComplexitySelect={handleComplexitySelect}
                        onDerivativesSelect={handleDerivativesSelect}
                        onMaterialSelect={handleMaterialSelect}
                        onDataQualitySelect={handleDataQualitySelect}
                        onCapabilitySelect={handleCapabilitySelect}
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
                  <ChatInput onSend={handleFreeText} disabled={isInputDisabled} />
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
                    className="bg-slate-50/80 overflow-y-auto flex-1"
                  >
                    <div className="p-8 h-full min-w-[600px] flex items-center justify-center">
                      <ResultsCard userData={userData} />
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
