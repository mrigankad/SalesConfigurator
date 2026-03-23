import { useRef, useCallback, useEffect } from 'react';
import type { InteractiveCardType } from '../types';
import { useChatStore } from '../store/chatStore';

export function useChat() {
  const messages     = useChatStore(s => s.messages);
  const currentStep  = useChatStore(s => s.currentStep);
  const userData     = useChatStore(s => s.userData);
  const isTyping     = useChatStore(s => s.isTyping);
  const setMessages  = useChatStore(s => s.setMessages);
  const setCurrentStep = useChatStore(s => s.setCurrentStep);
  const setUserData  = useChatStore(s => s.setUserData);
  const setIsTyping  = useChatStore(s => s.setIsTyping);
  const resetStore   = useChatStore(s => s.reset);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const addAiText = useCallback((text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}-${Math.random()}`,
        type: 'ai',
        content: text,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 800);
  }, []);

  const addAiInteractive = useCallback((type: InteractiveCardType, delay = 1500) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `ai-card-${Date.now()}-${Math.random()}`,
        type: 'ai',
        content: '',
        timestamp: new Date(),
        interactiveType: type,
      }]);
      setIsTyping(false);
    }, delay);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}-${Math.random()}`,
      type: 'user',
      content: text,
      timestamp: new Date(),
    }]);
  }, []);

  // --- STEP 0: Company Context ---

  const startConversation = useCallback(() => {
    setCurrentStep('greeting');
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    
    addAiText(`${greeting}! I'm your Dassault Systèmes sales advisor. I'll ask you a few quick questions about your project so I can put together a tailored proposal for you.`);
    setTimeout(() => {
      setCurrentStep('lead_capture');
      addAiInteractive('lead_capture');
    }, 1200);
  }, [addAiText, addAiInteractive]);

  const handleLeadSubmit = useCallback((name: string, email: string, phone: string) => {
    setUserData(prev => ({ ...prev, name, email, phone }));
    addUserMessage(`Hi, I'm ${name}. My email is ${email}${phone ? `, phone: ${phone}` : ''}.`);
    setCurrentStep('company_context');
    setTimeout(() => {
      addAiText(`Great to meet you, ${name.split(' ')[0]}! Let's start with some company information.`);
      setTimeout(() => {
        addAiInteractive('company_context');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleCompanySubmit = useCallback((companyName: string, website?: string, size?: string, country?: string) => {
    setUserData(prev => ({ ...prev, company_name: companyName, company_website: website ?? '', company_size: size ?? '', company_country: country ?? '' }));
    const extra = [website, size, country].filter(Boolean).join(' · ');
    addUserMessage(`Company: ${companyName}${extra ? ` (${extra})` : ''}`);
    setCurrentStep('industry_select');
    setTimeout(() => {
      addAiText("What industry does your company operate in?");
      setTimeout(() => {
        addAiInteractive('industry_select');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleIndustrySelect = useCallback((industry: string) => {
    setUserData(prev => ({ ...prev, industry }));
    addUserMessage(`Industry: ${industry}`);
    setCurrentStep('role_select');
    setTimeout(() => {
      addAiText("What is your role in the company?");
      setTimeout(() => {
        addAiInteractive('role_select');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleRoleSelect = useCallback((role: string) => {
    setUserData(prev => ({ ...prev, role }));
    addUserMessage(`Role: ${role}`);
    setCurrentStep('worked_before');
    setTimeout(() => {
      addAiText("Have you worked with us before?");
      setTimeout(() => {
        addAiInteractive('worked_before');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleWorkedBeforeSelect = useCallback((answer: string) => {
    setUserData(prev => ({ ...prev, worked_before: answer }));
    addUserMessage(`Worked before: ${answer}`);
    
    if (answer === 'Yes') {
      setCurrentStep('previous_projects');
      setTimeout(() => {
        addAiText("Great to have you back! Tell us about your previous projects with us.");
        setTimeout(() => {
          addAiInteractive('previous_projects');
        }, 1000);
      }, 500);
    } else {
      setCurrentStep('how_heard');
      setTimeout(() => {
        addAiText("Welcome! We'd love to know how you heard about us.");
        setTimeout(() => {
          addAiInteractive('how_heard');
        }, 1000);
      }, 500);
    }
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handlePreviousProjectsSubmit = useCallback((projects: string, lastEngagement: string) => {
    setUserData(prev => ({ ...prev, previous_projects: projects, last_engagement: lastEngagement }));
    addUserMessage(`Previous projects: ${projects}${lastEngagement ? ` (Last: ${lastEngagement})` : ''}`);
    setCurrentStep('project_timeline');
    setTimeout(() => {
      addAiText("What is the expected timeline for this project?");
      setTimeout(() => {
        addAiInteractive('project_timeline');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleHowHeardSelect = useCallback((howHeard: string, goal: string) => {
    setUserData(prev => ({ ...prev, how_heard: howHeard, project_goal: goal }));
    addUserMessage(`Heard via: ${howHeard}, Goal: ${goal}`);
    setCurrentStep('project_timeline');
    setTimeout(() => {
      addAiText("What is the expected timeline for this project?");
      setTimeout(() => {
        addAiInteractive('project_timeline');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleTimelineSelect = useCallback((timeline: string) => {
    setUserData(prev => ({ ...prev, timeline }));
    addUserMessage(`Timeline: ${timeline}`);
    setCurrentStep('cad_provision');
    setTimeout(() => {
      addAiText("Great, now let's talk about your CAD data. Will all relevant CAD files be available for the project?");
      setTimeout(() => {
        addAiInteractive('cad_provision');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  // --- STEP 1: Data Prep ---

  const handleCadProvisionSelect = useCallback((answer: string) => {
    setUserData(prev => ({ ...prev, cad_provided: answer }));
    addUserMessage(`CAD provided: ${answer}`);
    
    if (answer === 'No') {
      // Warning but continue
      setCurrentStep('cad_format_select');
      setTimeout(() => {
        addAiText("⚠️ Note: CAD data is required for project execution. Please arrange for CAD data provision. In which format will the CAD data be provided?");
        setTimeout(() => {
          addAiInteractive('cad_format_select');
        }, 1000);
      }, 500);
    } else {
      setCurrentStep('cad_format_select');
      setTimeout(() => {
        addAiText("Excellent! In which format will the CAD data be provided?");
        setTimeout(() => {
          addAiInteractive('cad_format_select');
        }, 1000);
      }, 500);
    }
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleCadFormatSelect = useCallback((format: string) => {
    setUserData(prev => ({ ...prev, cad_format: format }));
    addUserMessage(`CAD Format: ${format}`);
    setCurrentStep('model_hierarchy');
    setTimeout(() => {
      addAiText("What is the model line-up hierarchy for your cars?");
      setTimeout(() => {
        addAiInteractive('model_hierarchy');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleModelHierarchySubmit = useCallback((hierarchy: string[]) => {
    setUserData(prev => ({ ...prev, model_hierarchy: hierarchy }));
    addUserMessage(`Hierarchy: ${hierarchy.join(', ')}`);
    setCurrentStep('unique_models_count');
    setTimeout(() => {
      addAiText("Now let's talk about your model lineup. How many unique models do you have?");
      setTimeout(() => {
        addAiInteractive('unique_models_count');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  // --- STEP 2: Model Definition ---

  const handleUniqueModelsCount = useCallback((count: string) => {
    setUserData(prev => ({ ...prev, unique_models_count: count }));
    addUserMessage(`Unique models: ${count}`);
    setCurrentStep('model_name');
    setTimeout(() => {
      addAiText("What is the name of the model for which this questionnaire is filled?");
      setTimeout(() => {
        addAiInteractive('model_name');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleModelNameSubmit = useCallback((name: string) => {
    setUserData(prev => ({ ...prev, model_name: name }));
    addUserMessage(`Model name: ${name}`);
    setCurrentStep('unique_variants_count');
    setTimeout(() => {
      addAiText(`How many unique variants/grades do you have for ${name}?`);
      setTimeout(() => {
        addAiInteractive('unique_variants_count');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleUniqueVariantsCount = useCallback((count: string) => {
    setUserData(prev => ({ ...prev, unique_variants_count: count }));
    addUserMessage(`Variants: ${count}`);
    setCurrentStep('segment_select');
    setTimeout(() => {
      addAiText("What is the vehicle segment this car is planned to launch in?");
      setTimeout(() => {
        addAiInteractive('segment_select');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleSegmentSelect = useCallback((segment: string) => {
    setUserData(prev => ({ ...prev, segment }));
    addUserMessage(`Segment: ${segment}`);
    setCurrentStep('update_frequency');
    setTimeout(() => {
      addAiText("How often do you update your car models?");
      setTimeout(() => {
        addAiInteractive('update_frequency');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleUpdateFrequencySelect = useCallback((frequency: string) => {
    setUserData(prev => ({ ...prev, update_frequency: frequency }));
    addUserMessage(`Update frequency: ${frequency}`);
    setCurrentStep('body_type_select');
    setTimeout(() => {
      addAiText("Please specify the body type of this car model.");
      setTimeout(() => {
        addAiInteractive('body_type_select');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleBodyTypeSelect = useCallback((body: string) => {
    setUserData(prev => ({ ...prev, body_type: body }));
    addUserMessage(`Body type: ${body}`);
    setCurrentStep('trim_levels');
    setTimeout(() => {
      addAiText("Good. I'd like to understand the configuration depth. How many trim levels does this model have?");
      setTimeout(() => {
        addAiInteractive('trim_levels');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  // --- STEP 3: Configuration Details ---

  const handleTrimLevelsCount = useCallback((count: string) => {
    setUserData(prev => ({ ...prev, trim_levels: count }));
    addUserMessage(`Trim levels: ${count}`);
    setCurrentStep('wheel_types');
    setTimeout(() => {
      addAiText("How many wheel types are present for this model?");
      setTimeout(() => {
        addAiInteractive('wheel_types');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleWheelTypesCount = useCallback((count: string) => {
    setUserData(prev => ({ ...prev, wheel_types: count }));
    addUserMessage(`Wheel types: ${count}`);
    setCurrentStep('exterior_colors');
    setTimeout(() => {
      addAiText("How many exterior colors are available for this model?");
      setTimeout(() => {
        addAiInteractive('exterior_colors');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleExteriorColorsCount = useCallback((count: string) => {
    setUserData(prev => ({ ...prev, exterior_colors: count }));
    addUserMessage(`Exterior colors: ${count}`);
    setCurrentStep('interior_options');
    setTimeout(() => {
      addAiText("How many interior options are available for this model?");
      setTimeout(() => {
        addAiInteractive('interior_options');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleInteriorOptionsCount = useCallback((count: string) => {
    setUserData(prev => ({ ...prev, interior_options: count }));
    addUserMessage(`Interior options: ${count}`);
    setCurrentStep('markets');
    setTimeout(() => {
      addAiText("In which geographical markets will this model be available?");
      setTimeout(() => {
        addAiInteractive('markets');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleMarketsSubmit = useCallback((markets: string[]) => {
    setUserData(prev => ({ ...prev, markets: markets.join(', ') }));
    addUserMessage(`Markets: ${markets.join(', ')}`);
    setCurrentStep('customization_level');
    setTimeout(() => {
      addAiText("What is the level of customization offered for this model?");
      setTimeout(() => {
        addAiInteractive('customization_level');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleCustomizationLevelSelect = useCallback((level: string) => {
    setUserData(prev => ({ ...prev, customization_level: level }));
    addUserMessage(`Customization: ${level}`);
    setCurrentStep('exterior_modeling');
    setTimeout(() => {
      addAiText("Almost there. A few questions about the modeling scope — do you need additional exterior modeling work?");
      setTimeout(() => {
        addAiInteractive('exterior_modeling');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  // --- STEP 4: Modeling Related ---

  const handleExteriorModelingSelect = useCallback((answer: string) => {
    setUserData(prev => ({ ...prev, exterior_modeling_needed: answer }));
    addUserMessage(`Exterior modeling: ${answer}`);
    setCurrentStep('interior_soft_parts');
    setTimeout(() => {
      addAiText("Do we need to provide soft parts modeling for interior?");
      setTimeout(() => {
        addAiInteractive('interior_soft_parts');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleInteriorSoftPartsSelect = useCallback((answer: string) => {
    setUserData(prev => ({ ...prev, interior_soft_parts_needed: answer }));
    addUserMessage(`Interior soft parts: ${answer}`);
    setCurrentStep('reference_data_provided');
    setTimeout(() => {
      addAiText("Will all reference data for modeling be provided before project start?");
      setTimeout(() => {
        addAiInteractive('reference_data_provided');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleReferenceDataSelect = useCallback((answer: string) => {
    setUserData(prev => ({ ...prev, reference_data_provided: answer }));
    addUserMessage(`Reference data: ${answer}`);
    setCurrentStep('cad_shape_reference');
    setTimeout(() => {
      addAiText("Will CAD data as shape & volume reference for soft parts be provided?");
      setTimeout(() => {
        addAiInteractive('cad_shape_reference');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleCadShapeReferenceSelect = useCallback((answer: string) => {
    setUserData(prev => ({ ...prev, cad_shape_reference_provided: answer }));
    addUserMessage(`CAD shape reference: ${answer}`);
    setCurrentStep('scanning_needed');
    setTimeout(() => {
      addAiText("Is there a need for 3D scanning for soft part modeling?");
      setTimeout(() => {
        addAiInteractive('scanning_needed');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleScanningNeededSelect = useCallback((answer: string) => {
    setUserData(prev => ({ ...prev, scanning_needed: answer }));
    addUserMessage(`3D scanning needed: ${answer}`);
    setCurrentStep('material_samples');
    setTimeout(() => {
      addAiText("Last section — materials. Will physical material samples be available for all variants?");
      setTimeout(() => {
        addAiInteractive('material_samples');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  // --- STEP 5: Material Related ---

  const handleMaterialSamplesSelect = useCallback((answer: string) => {
    setUserData(prev => ({ ...prev, material_samples_provided: answer }));
    addUserMessage(`Material samples: ${answer}`);
    setCurrentStep('texture_samples');
    setTimeout(() => {
      addAiText("Will texture samples be provided for all variants?");
      setTimeout(() => {
        addAiInteractive('texture_samples');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleTextureSamplesSelect = useCallback((answer: string) => {
    setUserData(prev => ({ ...prev, texture_samples_provided: answer }));
    addUserMessage(`Texture samples: ${answer}`);
    setCurrentStep('calculating');
    setTimeout(() => {
      addAiText("Perfect — I have everything I need. Let me put together your personalised estimate now...");
      setTimeout(() => {
        setCurrentStep('results');
        addAiInteractive('results');
      }, 2500);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  // --- Free Text & Reset ---

  const handleFreeText = useCallback(async (text: string) => {
    addUserMessage(text);
    setIsTyping(true);

    try {
      const { askLLM } = await import('../lib/azureAI');
      const state = useChatStore.getState();
      const { reply, extracted } = await askLLM(text, state.messages, state.userData, state.currentStep);

      // Show the LLM reply
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}-${Math.random()}`,
        type: 'ai',
        content: reply,
        timestamp: new Date(),
      }]);

      // If the LLM extracted a valid answer, advance the flow automatically
      if (extracted !== null && extracted !== 'null' && extracted.trim() !== '') {
        const step = state.currentStep;
        setTimeout(() => {
          switch (step) {
            case 'company_context':        handleCompanySubmit(extracted); break;
            case 'industry_select':        handleIndustrySelect(extracted); break;
            case 'role_select':            handleRoleSelect(extracted); break;
            case 'worked_before':          handleWorkedBeforeSelect(extracted); break;
            case 'how_heard':              handleHowHeardSelect(extracted, ''); break;
            case 'project_timeline':       handleTimelineSelect(extracted); break;
            case 'cad_provision':          handleCadProvisionSelect(extracted); break;
            case 'cad_format_select':      handleCadFormatSelect(extracted); break;
            case 'model_hierarchy':        handleModelHierarchySubmit(extracted.split(',').map(s => s.trim())); break;
            case 'unique_models_count':    handleUniqueModelsCount(extracted); break;
            case 'model_name':             handleModelNameSubmit(extracted); break;
            case 'unique_variants_count':  handleUniqueVariantsCount(extracted); break;
            case 'segment_select':         handleSegmentSelect(extracted); break;
            case 'update_frequency':       handleUpdateFrequencySelect(extracted); break;
            case 'body_type_select':       handleBodyTypeSelect(extracted); break;
            case 'trim_levels':            handleTrimLevelsCount(extracted); break;
            case 'wheel_types':            handleWheelTypesCount(extracted); break;
            case 'exterior_colors':        handleExteriorColorsCount(extracted); break;
            case 'interior_options':       handleInteriorOptionsCount(extracted); break;
            case 'markets':                handleMarketsSubmit(extracted.split(',').map(s => s.trim())); break;
            case 'customization_level':    handleCustomizationLevelSelect(extracted); break;
            case 'exterior_modeling':      handleExteriorModelingSelect(extracted); break;
            case 'interior_soft_parts':    handleInteriorSoftPartsSelect(extracted); break;
            case 'reference_data_provided':handleReferenceDataSelect(extracted); break;
            case 'cad_shape_reference':    handleCadShapeReferenceSelect(extracted); break;
            case 'scanning_needed':        handleScanningNeededSelect(extracted); break;
            case 'material_samples':       handleMaterialSamplesSelect(extracted); break;
            case 'texture_samples':        handleTextureSamplesSelect(extracted); break;
          }
        }, 600);
      }

      if (state.currentStep === 'results' || state.currentStep === 'post_results') {
        setCurrentStep('post_results');
      }

    } catch (err: any) {
      console.error('LLM error:', err?.message ?? err);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}-${Math.random()}`,
        type: 'ai',
        content: "Sorry, I had trouble processing that. Could you try again?",
        timestamp: new Date(),
      }]);
    }
  }, [
    addUserMessage, setIsTyping, setMessages, currentStep,
    handleCompanySubmit, handleIndustrySelect, handleRoleSelect,
    handleWorkedBeforeSelect, handleHowHeardSelect, handleTimelineSelect,
    handleCadProvisionSelect, handleCadFormatSelect, handleModelHierarchySubmit,
    handleUniqueModelsCount, handleModelNameSubmit, handleUniqueVariantsCount,
    handleSegmentSelect, handleUpdateFrequencySelect, handleBodyTypeSelect,
    handleTrimLevelsCount, handleWheelTypesCount, handleExteriorColorsCount,
    handleInteriorOptionsCount, handleMarketsSubmit, handleCustomizationLevelSelect,
    handleExteriorModelingSelect, handleInteriorSoftPartsSelect, handleReferenceDataSelect,
    handleCadShapeReferenceSelect, handleScanningNeededSelect,
    handleMaterialSamplesSelect, handleTextureSamplesSelect,
  ]);

  const resetChat = useCallback(() => {
    resetStore();
  }, [resetStore]);

  return {
    messages,
    currentStep,
    userData,
    isTyping,
    messagesEndRef,
    // Flow
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
  };
}
