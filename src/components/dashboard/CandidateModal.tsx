import { Modal, Descriptions, Timeline } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

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
      title={
        <h3 className=" text-xl font-semibold text-gray-900 m-0">
          Candidate Details
        </h3>
      }
      open={true}
      onCancel={onClose}
      footer={
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 border border-gray-300 transition-all duration-200"
        >
          Close
        </button>
      }
      width={900}
      className="candidate-modal "
    >
      <div className="space-y-6">
        <Descriptions 
          bordered 
          column={2}
          className="candidate-descriptions"
        >
          <Descriptions.Item label={<span className="font-medium text-gray-700">Name</span>}>
            <span className="text-gray-900 font-medium">{candidate.name || "N/A"}</span>
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-medium text-gray-700">Email</span>}>
            <span className="text-gray-900">{candidate.email || "N/A"}</span>
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-medium text-gray-700">Phone</span>}>
            <span className="text-gray-900">{candidate.phone || "N/A"}</span>
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-medium text-gray-700">Final Score</span>}>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-base font-semibold bg-indigo-100 text-indigo-700">
              {candidate.finalScore || "N/A"}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-medium text-gray-700">Summary</span>} span={2}>
            <p className="text-gray-700 leading-relaxed m-0">{candidate.finalSummary || "N/A"}</p>
          </Descriptions.Item>
        </Descriptions>

        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ClockCircleOutlined className="text-indigo-600" />
            Interview Timeline
          </h4>
          <Timeline
            items={candidate.chatHistory.map((item, index) => ({
              key: index,
              dot: <CheckCircleOutlined className="text-emerald-600" />,
              children: (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-3">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-indigo-600">Question {index + 1}:</span>
                      <p className="text-gray-900 mt-1 leading-relaxed font-medium">{item.q}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Answer:</span>
                      <p className="text-gray-700 mt-1 leading-relaxed">
                        {item.a || <span className="italic text-gray-500">No answer provided</span>}
                      </p>
                    </div>
                    <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                      <span className="text-sm font-semibold text-gray-700">Score:</span>
                      <span className="text-sm font-bold text-indigo-600">{item.score ?? "N/A"}</span>
                      <span className="text-sm text-gray-400">—</span>
                      <span className="text-sm text-gray-600 italic flex-1">
                        {item.justification ?? "No justification."}
                      </span>
                    </div>
                  </div>
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CandidateModal;