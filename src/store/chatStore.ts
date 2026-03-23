import { create } from 'zustand';
import type { Message, ChatStep, UserData } from '../types';
import { INITIAL_USER_DATA } from '../constants/services';

export interface ConfiguratorState {
  selectedColor: string;
  selectedWheel: number;
  selectedTrim: number;
  selectedInterior: string;
}

const INITIAL_CONFIGURATOR: ConfiguratorState = {
  selectedColor: '#C0C0C0',
  selectedWheel: 0,
  selectedTrim: 0,
  selectedInterior: 'black',
};

interface ChatStore {
  messages: Message[];
  currentStep: ChatStep;
  userData: UserData;
  isTyping: boolean;
  configurator: ConfiguratorState;
  canvasMode: 'quote' | 'configurator';

  setMessages: (fn: (prev: Message[]) => Message[]) => void;
  setCurrentStep: (step: ChatStep) => void;
  setUserData: (fn: (prev: UserData) => UserData) => void;
  setIsTyping: (v: boolean) => void;
  setConfigurator: (fn: (prev: ConfiguratorState) => ConfiguratorState) => void;
  setCanvasMode: (mode: 'quote' | 'configurator') => void;
  reset: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  currentStep: 'idle',
  userData: { ...INITIAL_USER_DATA },
  isTyping: false,
  configurator: { ...INITIAL_CONFIGURATOR },
  canvasMode: 'quote',

  setMessages: (fn) => set((s) => ({ messages: fn(s.messages) })),
  setCurrentStep: (step) => set({ currentStep: step }),
  setUserData: (fn) => set((s) => ({ userData: fn(s.userData) })),
  setIsTyping: (v) => set({ isTyping: v }),
  setConfigurator: (fn) => set((s) => ({ configurator: fn(s.configurator) })),
  setCanvasMode: (mode) => set({ canvasMode: mode }),
  reset: () =>
    set({
      messages: [],
      currentStep: 'idle',
      userData: { ...INITIAL_USER_DATA },
      isTyping: false,
      configurator: { ...INITIAL_CONFIGURATOR },
      canvasMode: 'quote',
    }),
}));
