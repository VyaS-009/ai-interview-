import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  currentTab: "interviewee" | "interviewer";
  showWelcomeModal: boolean;
}

const initialState: UIState = {
  currentTab: "interviewee",
  showWelcomeModal: true, // Show on initial load
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCurrentTab(state, action: PayloadAction<"interviewee" | "interviewer">) {
      state.currentTab = action.payload;
    },
    setShowWelcomeModal(state, action: PayloadAction<boolean>) {
      state.showWelcomeModal = action.payload;
    },
  },
});

export const { setCurrentTab, setShowWelcomeModal } = uiSlice.actions;
export default uiSlice.reducer;
