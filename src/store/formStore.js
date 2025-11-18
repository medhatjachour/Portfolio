// Zustand store for form state management
import { create } from 'zustand';

/**
 * Form Store
 * Manages contact form state and submission status
 */
export const useFormStore = create((set) => ({
  isSubmitting: false,
  submitSuccess: false,
  submitError: null,
  
  /**
   * Set form submitting state
   */
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  
  /**
   * Set form submission success
   */
  setSuccess: (success) => set({ submitSuccess: success, submitError: null }),
  
  /**
   * Set form submission error
   */
  setError: (error) => set({ submitError: error, submitSuccess: false }),
  
  /**
   * Reset form state
   */
  reset: () => set({ isSubmitting: false, submitSuccess: false, submitError: null }),
}));
