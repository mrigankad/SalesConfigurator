import { useState, useRef, useCallback, useEffect } from 'react';
import type { Message, ChatStep, UserData, InteractiveCardType } from '../types';
import { INITIAL_USER_DATA } from '../constants/services';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<ChatStep>('idle');
  const [userData, setUserData] = useState<UserData>({ ...INITIAL_USER_DATA });
  const [isTyping, setIsTyping] = useState(false);
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

  // --- Flow Handlers ---

  const startConversation = useCallback(() => {
    setCurrentStep('greeting');
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    
    addAiText(`${greeting}! I'm Dassault Helper — your AI sales assistant. I can generate an instant project quote for you.`);
    setTimeout(() => {
      setCurrentStep('lead_capture');
      addAiInteractive('lead_capture');
    }, 1200);
  }, [addAiText, addAiInteractive]);

  const handleLeadSubmit = useCallback((name: string, email: string, phone: string) => {
    setUserData(prev => ({ ...prev, name, email, phone }));
    addUserMessage(`Hi, I'm ${name}. My email is ${email}.`);
    setCurrentStep('model_select');
    setTimeout(() => {
      addAiText(`Great to meet you, ${name.split(' ')[0]}! Let's configure your project starting with the solution type.`);
      setTimeout(() => {
        addAiInteractive('model_select');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleModelSelect = useCallback((type: string) => {
    setUserData(prev => ({ ...prev, model_type: type }));
    addUserMessage(`Selected Solution: ${type}`);
    setCurrentStep('cad_format_select');
    setTimeout(() => {
      addAiText("Essential first step: In which format will the CAD data be provided? (e.g., CATIA, STEP, JT)");
      setTimeout(() => {
        addAiInteractive('cad_format_select');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleCadFormatSelect = useCallback((format: string) => {
    setUserData(prev => ({ ...prev, cad_format: format }));
    addUserMessage(`Format: ${format}`);
    setCurrentStep('segment_select');
    setTimeout(() => {
      addAiText("Got it. Now, what is the vehicle segment this project covers?");
      setTimeout(() => {
        addAiInteractive('segment_select');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleSegmentSelect = useCallback((segment: string) => {
    setUserData(prev => ({ ...prev, segment }));
    addUserMessage(`Segment: ${segment}`);
    setCurrentStep('body_type_select');
    setTimeout(() => {
      addAiText("Understood. Please specify the body type for this model.");
      setTimeout(() => {
        addAiInteractive('body_type_select');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleBodyTypeSelect = useCallback((body: string) => {
    setUserData(prev => ({ ...prev, body_type: body }));
    addUserMessage(`Body Style: ${body}`);
    setCurrentStep('complexity_select');
    setTimeout(() => {
      addAiText("Perfect. Considering these specs, how would you describe the overall project complexity?");
      setTimeout(() => {
        addAiInteractive('complexity_select');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleComplexitySelect = useCallback((lvl: string) => {
    setUserData(prev => ({ ...prev, complexity: lvl }));
    addUserMessage(`${lvl} complexity.`);
    setCurrentStep('derivatives_select');
    setTimeout(() => {
      addAiText("Got it. How many derivatives should we plan for?");
      setTimeout(() => {
        addAiInteractive('derivatives_select');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleDerivativesSelect = useCallback((num: string) => {
    setUserData(prev => ({ ...prev, derivatives: num }));
    addUserMessage(`Planning for ${num} derivative(s).`);
    setCurrentStep('material_complexity_select');
    setTimeout(() => {
      addAiText("Understood. Now, tell me about the material fidelity required.");
      setTimeout(() => {
        addAiInteractive('material_complexity_select');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleMaterialSelect = useCallback((mat: string) => {
    setUserData(prev => ({ ...prev, material_complexity: mat }));
    addUserMessage(`${mat} materials.`);
    setCurrentStep('data_quality_select');
    setTimeout(() => {
      addAiText("What is the current state of your source data?");
      setTimeout(() => {
        addAiInteractive('data_quality_select');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleDataQualitySelect = useCallback((qual: string) => {
    setUserData(prev => ({ ...prev, data_quality: qual }));
    addUserMessage(`Data quality: ${qual}`);
    setCurrentStep('capability_select');
    setTimeout(() => {
      addAiText("Last question: what level of support do you need from our team?");
      setTimeout(() => {
        addAiInteractive('capability_select');
      }, 1000);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleCapabilitySelect = useCallback((cap: string) => {
    setUserData(prev => ({ ...prev, client_capability: cap }));
    addUserMessage(`${cap} support model.`);
    setCurrentStep('calculating');
    setTimeout(() => {
      addAiText("Excellent! Processing your requirements to generate a personalized project estimate...");
      setTimeout(() => {
        setCurrentStep('results');
        addAiInteractive('results');
      }, 2500);
    }, 500);
  }, [addUserMessage, addAiText, addAiInteractive]);

  const handleFreeText = useCallback((text: string) => {
    addUserMessage(text);
    if (currentStep === 'results' || currentStep === 'post_results') {
      setCurrentStep('post_results');
      setTimeout(() => {
        addAiText("Thanks for your message! A sales representative will follow up. Is there anything else I can help with?");
      }, 800);
    }
  }, [addUserMessage, addAiText, currentStep]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setCurrentStep('idle');
    setUserData({ ...INITIAL_USER_DATA });
    setIsTyping(false);
  }, []);

  return {
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
  };
}
