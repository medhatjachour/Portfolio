import { create } from 'zustand';

/**
 * Agent Store — manages the AI chat widget state
 */
export const useAgentStore = create((set) => ({
  isOpen: false,
  messages: [],
  isThinking: false,

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setThinking: (val) => set({ isThinking: val }),
  clearMessages: () => set({ messages: [] }),
}));
