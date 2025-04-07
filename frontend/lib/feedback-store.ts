interface FeedbackData {
  fieldName: string;
  originalValue: string | number | null;
  currentValue: string | number | null;
  correction: string;
  explanation: string;
  timestamp: number;
}

interface CorrectionData {
  value: string | number | null;
  timestamp: number;
}

const FEEDBACK_STORAGE_KEY = 'property_feedback';
const CORRECTIONS_STORAGE_KEY = 'property_corrections';

export const feedbackStore = {
  getFeedback(fieldName: string): FeedbackData | null {
    const feedback = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!feedback) return null;
    
    const feedbackData: Record<string, FeedbackData> = JSON.parse(feedback);
    return feedbackData[fieldName] || null;
  },

  saveFeedback(fieldName: string, data: Omit<FeedbackData, 'timestamp'>) {
    const feedback = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    const feedbackData: Record<string, FeedbackData> = feedback ? JSON.parse(feedback) : {};
    
    feedbackData[fieldName] = {
      ...data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbackData));
  },

  getAllFeedback(): Record<string, FeedbackData> {
    const feedback = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return feedback ? JSON.parse(feedback) : {};
  },

  getCorrection(fieldName: string): CorrectionData | null {
    const corrections = localStorage.getItem(CORRECTIONS_STORAGE_KEY);
    if (!corrections) return null;
    
    const correctionData: Record<string, CorrectionData> = JSON.parse(corrections);
    return correctionData[fieldName] || null;
  },

  saveCorrection(fieldName: string, value: string | number | null) {
    const corrections = localStorage.getItem(CORRECTIONS_STORAGE_KEY);
    const correctionData: Record<string, CorrectionData> = corrections ? JSON.parse(corrections) : {};
    
    correctionData[fieldName] = {
      value,
      timestamp: Date.now()
    };
    
    localStorage.setItem(CORRECTIONS_STORAGE_KEY, JSON.stringify(correctionData));
  },

  getAllCorrections(): Record<string, CorrectionData> {
    const corrections = localStorage.getItem(CORRECTIONS_STORAGE_KEY);
    return corrections ? JSON.parse(corrections) : {};
  },

  clear() {
    localStorage.removeItem(FEEDBACK_STORAGE_KEY);
    localStorage.removeItem(CORRECTIONS_STORAGE_KEY);
  }
}; 