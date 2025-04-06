import { create } from "zustand";

const useStore = create((set) => ({
  url: "",
  isAnalyzing: false,
  analysisResults: null,
  error: null,

  setUrl: (url) => set({ url }),

  startAnalysis: () =>
    set({
      isAnalyzing: true,
      error: null,
      analysisResults: null,
    }),

  setAnalysisResults: (results) =>
    set({
      analysisResults: results,
      isAnalyzing: false,
    }),

  setError: (error) =>
    set({
      error,
      isAnalyzing: false,
    }),

  resetAnalysis: () =>
    set({
      analysisResults: null,
      error: null,
    }),
}));

export default useStore;
