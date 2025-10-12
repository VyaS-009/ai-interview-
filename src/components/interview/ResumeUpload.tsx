import { App, Upload, message } from "antd";
import { CloudArrowUpIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { setCandidateInfo} from "@/lib/redux/slices/interviewSlice";
import { useUploadResumeMutation} from "@/lib/api/interviewApi";
import { RcFile } from "antd/es/upload";
import { CandidateInfo } from "@/types/interview";
import { RootState } from "@/lib/redux/store";

const { Dragger } = Upload;

interface CustomRequestOptions {
  file: RcFile | string | Blob;
  onSuccess?: (body: CandidateInfo, xhr?: XMLHttpRequest) => void;
  onError?: (error: Error) => void;
}

interface ResumeUploadProps {
  onUploadSuccess?: () => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadSuccess }) => {
  const dispatch = useDispatch();
  const { message: messageApi } = App.useApp();
  const [uploadResume, { isLoading }] = useUploadResumeMutation();
  const { sessionId } = useSelector((state: RootState) => state.interview);

  const uploadProps = {
    name: "file",
    accept: ".pdf,.docx",
    beforeUpload: (file: File) => {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("File must be smaller than 2MB!");
        return false;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }: CustomRequestOptions) => {
      try {
        if (!sessionId) {
          throw new Error("Session not started. Please start a new interview first.");
        }
        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadResume(formData).unwrap();
        dispatch(setCandidateInfo(response));
        // Call the success callback to close the modal
        onUploadSuccess?.();
        onSuccess?.(response); 
        messageApi.success("Resume uploaded successfully!");
      } catch (error) {
        const err = error instanceof Error ? error : new Error("An unknown error occurred");
        onError?.(err); 
        messageApi.error(
          (err as { data?: { error?: string } })?.data?.error ||
          "Failed to upload resume."
        );
      }
    },
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="backdrop-blur-xl  rounded-3xl border border-white/50 shadow-2xl shadow-purple-800/10 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Your Resume</h2>
            <p className="text-gray-600">Start your interview journey by sharing your professional profile</p>
          </div>
          
          <Dragger 
            {...uploadProps} 
            disabled={isLoading}
            className="upload-dragger-modern"
          >
            <div className="py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-float">
                <CloudArrowUpIcon className="w-10 h-10 text-white" />
              </div>
              
              <p className="text-xl font-semibold text-gray-800 mb-2">
                Drop your resume here
              </p>
              <p className="text-base text-gray-600 mb-4">
                or click to browse files
              </p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
                <DocumentTextIcon className="w-4 h-4" />
                <span>PDF, DOCX (max 2MB)</span>
              </div>
            </div>
          </Dragger>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;