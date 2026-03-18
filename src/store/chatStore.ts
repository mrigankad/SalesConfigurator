import { create } from 'zustand';
import type { Message, ChatStep, UserData } from '../types';
import { INITIAL_USER_DATA } from '../constants/services';

interface ChatStore {
  messages: Message[];
  currentStep: ChatStep;
  userData: UserData;
  isTyping: boolean;

  // Setters
  setMessages: (fn: (prev: Message[]) => Message[]) => void;
  setCurrentStep: (step: ChatStep) => void;
  setUserData: (fn: (prev: UserData) => UserData) => void;
  setIsTyping: (v: boolean) => void;
  reset: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  currentStep: 'idle',
  userData: { ...INITIAL_USER_DATA },
  isTyping: false,

  setMessages: (fn) => set((s) => ({ messages: fn(s.messages) })),
  setCurrentStep: (step) => set({ currentStep: step }),
  setUserData: (fn) => set((s) => ({ userData: fn(s.userData) })),
  setIsTyping: (v) => set({ isTyping: v }),
  reset: () =>
    set({ messages: [], currentStep: 'idle', userData: { ...INITIAL_USER_DATA }, isTyping: false }),
}));
