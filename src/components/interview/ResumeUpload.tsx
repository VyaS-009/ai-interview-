import { Upload, Button, Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setCandidateInfo } from "@/lib/redux/slices/interviewSlice";
import { useUploadResumeMutation } from "@/lib/api/interviewApi";

const { Dragger } = Upload;

const ResumeUpload: React.FC = () => {
  const dispatch = useDispatch();
  const [uploadResume, { isLoading }] = useUploadResumeMutation();

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
    customRequest: async ({ file, onSuccess, onError }: any) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadResume(formData).unwrap();
        dispatch(setCandidateInfo(response));
        onSuccess(response);
        message.success("Resume uploaded successfully!");
      } catch (error) {
        onError(error);
        message.error("Failed to upload resume.");
      }
    },
  };

  return (
    <Card title="Upload Your Resume">
      <Dragger {...uploadProps} disabled={isLoading}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to upload</p>
        <p className="ant-upload-hint">Support for PDF, DOCX (max 2MB)</p>
      </Dragger>
    </Card>
  );
};

export default ResumeUpload;
