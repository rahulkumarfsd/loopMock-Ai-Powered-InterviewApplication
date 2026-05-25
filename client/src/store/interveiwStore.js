import { create } from 'zustand';
import { interviewService } from '../services';
import toast from 'react-hot-toast';

const useInterviewStore = create((set, get) => ({
  interview:       null,
  currentQuestion: null,
  questionNumber:  1,
  lastFeedback:    null,
  isLoading:       false,
  isSubmitting:    false,

  // Called from Dashboard after start — loads interview into store
  setInterview: (interview) => set({ interview, questionNumber: 0, lastFeedback: null, currentQuestion: null }),

  startInterview: async ({ type, mode = 'text', company = '', totalQuestions = 5 }) => {
    set({ isLoading: true });
    try {
      const { data } = await interviewService.start({ type, mode, company, totalQuestions });
      set({ interview: data.interview, questionNumber: 0, lastFeedback: null, currentQuestion: null, isLoading: false });
      return data.interview;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview');
      set({ isLoading: false });
      return null;
    }
  },

  // Load interview by ID (when navigating directly to /interview/:id)
  loadInterview: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await interviewService.getById(id);
      set({ interview: data.interview, isLoading: false });
      return data.interview;
    } catch (err) {
      toast.error('Could not load interview');
      set({ isLoading: false });
      return null;
    }
  },

  fetchNextQuestion: async () => {
    const { interview } = get();
    if (!interview) return null;
    set({ isLoading: true, currentQuestion: null });
    try {
      const { data } = await interviewService.getNextQuestion(interview._id);
      set({ currentQuestion: data.question, questionNumber: data.questionNumber, isLoading: false });
      return data.question;
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not load question';
      toast.error(msg);
      set({ isLoading: false });
      return null;
    }
  },

  submitAnswer: async ({ answerText, answerType, code, language, timeTaken }) => {
    const { interview, currentQuestion } = get();
    if (!interview || !currentQuestion) return null;
    set({ isSubmitting: true });
    try {
      const { data } = await interviewService.submitAnswer(interview._id, {
        questionId:   currentQuestion._id,
        questionText: currentQuestion.body,
        answerText, answerType, code, language, timeTaken,
      });
      // Update questionsAnswered in store so handleNext works correctly
      set((state) => ({
        lastFeedback: data.feedback,
        isSubmitting: false,
        interview: state.interview
          ? { ...state.interview, questionsAnswered: data.questionsAnswered }
          : state.interview,
      }));
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit answer');
      set({ isSubmitting: false });
      return null;
    }
  },

  completeInterview: async () => {
    const { interview } = get();
    if (!interview) return null;
    set({ isLoading: true });
    try {
      const { data } = await interviewService.complete(interview._id);
      set({ interview: data.interview, isLoading: false });
      return data.interview;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete interview');
      set({ isLoading: false });
      return null;
    }
  },

  reset: () => set({
    interview: null, currentQuestion: null,
    questionNumber: 1, lastFeedback: null,
    isLoading: false, isSubmitting: false,
  }),
}));

export default useInterviewStore;