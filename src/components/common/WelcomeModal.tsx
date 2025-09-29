// src/components/common/WelcomeModal.tsx
"use client";

import { Modal, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { resetInterview } from "@/lib/redux/slices/interviewSlice";
import { setShowWelcomeModal } from "@/lib/redux/slices/uiSlice";
import { useEffect } from "react";

const WelcomeModal: React.FC = () => {
  const dispatch = useDispatch();
  const { interviewStatus, candidateInfo } = useSelector(
    (state: RootState) => state.interview
  );
  const showWelcomeModal = useSelector(
    (state: RootState) => state.ui.showWelcomeModal
  );

  // Only show modal for valid unfinished sessions
  const hasUnfinishedSession = !!(
    interviewStatus === "collecting-info" ||
    (interviewStatus === "in-progress" && candidateInfo)
  );

  // If there's no unfinished session, dismiss the modal check automatically.
  useEffect(() => {
    if (!hasUnfinishedSession && showWelcomeModal) {
      dispatch(setShowWelcomeModal(false));
    }
  }, [hasUnfinishedSession, showWelcomeModal, dispatch]);

  const handleContinue = () => {
    // Just close the modal, the app will already be in the correct state.
    dispatch(setShowWelcomeModal(false));
  };

  const handleStartNew = () => {
    dispatch(resetInterview());
    dispatch(setShowWelcomeModal(false));
  };

  return (
    <Modal
      title="Welcome Back!"
      open={hasUnfinishedSession && showWelcomeModal}
      footer={[
        <Button key="new" onClick={handleStartNew}>
          Start New Interview
        </Button>,
        <Button key="continue" type="primary" onClick={handleContinue}>
          Continue Interview
        </Button>,
      ]}
      closable={false}
    >
      <p>You have an unfinished interview session.</p>
      <p>
        Would you like to continue where you left off or start a new interview?
      </p>
    </Modal>
  );
};

export default WelcomeModal;
