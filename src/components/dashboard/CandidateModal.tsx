import { Modal, Descriptions, Timeline } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

interface CandidateModalProps {
  candidateId: string;
  onClose: () => void;
}

const CandidateModal: React.FC<CandidateModalProps> = ({
  candidateId,
  onClose,
}) => {
  const candidate = useSelector((state: RootState) =>
    state.interview.candidates.find((c) => c.id === candidateId)
  );

  if (!candidate) return null;

  return (
    <Modal
      title="Candidate Details"
      open={true}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions bordered>
        <Descriptions.Item label="Name">
          {candidate.name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {candidate.email || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {candidate.phone || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Final Score">
          {candidate.finalScore || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Summary" span={3}>
          {candidate.finalSummary || "N/A"}
        </Descriptions.Item>
      </Descriptions>
      <h3 style={{ marginTop: "16px" }}>Chat History</h3>
      <Timeline
        items={candidate.chatHistory.map((item, index) => ({
          key: index,
          children: (
            <>
              <p>
                <strong>Question {index + 1}:</strong> {item.q}
              </p>
              <p>
                <strong>Answer:</strong> {item.a || "No answer provided"}
              </p>
              <p>
                <strong>Score:</strong> {item.score ?? "N/A"} -{" "}
                <em>{item.justification ?? "No justification."}</em>
              </p>
            </>
          ),
        }))}
      />
    </Modal>
  );
};

export default CandidateModal;
