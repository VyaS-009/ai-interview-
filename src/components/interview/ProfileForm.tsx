"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, message, Select, Card, Typography, Modal, Alert } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  RiseOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {  setInterviewStatus } from "@/lib/redux/slices/interviewSlice";
import { CandidateInfo } from "@/types/interview";
import ResumeUpload from "./ResumeUpload";

const { Title } = Typography;
const { TextArea } = Input;

const ProfileForm: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { candidateInfo } = useSelector((state: RootState) => state.interview);

  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);

  // When candidateInfo is updated by the resume upload, update the form fields
  useEffect(() => {
    form.setFieldsValue(candidateInfo);
  }, [candidateInfo, form]);

  const onFinish = (values: CandidateInfo) => {
    // Skills might be a string from the Select component, so we ensure it's an array
    const finalValues = {
      ...values,
      skills: Array.isArray(values.skills) ? values.skills : (values.skills ? String(values.skills).split(',') : []),
    };
    dispatch(setInterviewStatus({ status: "in-progress", info: finalValues }));
    message.success("Profile confirmed! Starting your interview...");
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12 animate-fadeIn">
        <Title level={2} className="!text-4xl !font-bold !mb-3 !bg-gradient-to-r !from-violet-600 !to-purple-600 !bg-clip-text !text-transparent">
          Confirm Your Details
        </Title>
        <p className="text-lg text-gray-600">
          Your resume has been parsed. Please review, edit, and add any missing information below.
        </p>
      </div>

      <Alert
        message="Want to speed things up?"
        description={
          <div className="flex items-center justify-between">
            <span>Automatically fill the fields by uploading your resume.</span>
            <Button
              icon={<CloudUploadOutlined />}
              onClick={() => setIsUploadModalVisible(true)}
            >
              Upload Resume
            </Button>
          </div>
        }
        type="info"
        showIcon
        className="mb-8 !bg-white/50 !border-blue-200"
      />

      <Card className="!backdrop-blur-xl !bg-white/70 !rounded-3xl !border !border-white/50 !shadow-2xl !shadow-purple-500/10 animate-fadeIn animation-delay-200">
        <Form
          form={form}
          layout="vertical"
          initialValues={candidateInfo || { skills: [] }}
          onFinish={onFinish}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8"
        >
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input size="large" prefix={<UserOutlined />} placeholder="John Doe" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input size="large" prefix={<MailOutlined />} placeholder="john.doe@example.com" />
          </Form.Item>

          <Form.Item name="phone" label="Phone Number">
            <Input size="large" prefix={<PhoneOutlined />} placeholder="(555) 123-4567" />
          </Form.Item>

          <Form.Item name="occupation" label="Current Occupation">
            <Select
              size="large"
              placeholder="e.g., Student, Employed, Graduate"
              options={[
                { value: 'student', label: 'Student' },
                { value: 'employed', label: 'Employed' },
                { value: 'graduate', label: 'Recent Graduate' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </Form.Item>

          <Form.Item name="skills" label="Skills" className="col-span-1 md:col-span-2">
            <Select
              mode="tags"
              size="large"
              tokenSeparators={[',']}
              placeholder="e.g., React, Node.js, Python, SQL"
              notFoundContent={null}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item name="jobRole" label="Target Job Role (Optional)" className="col-span-1 md:col-span-2">
            <Input size="large" prefix={<RiseOutlined />} placeholder="e.g., Senior Frontend Developer" />
          </Form.Item>

          <Form.Item name="jobDescription" label="Target Job Description (Optional)" className="col-span-1 md:col-span-2">
            <TextArea
              rows={4}
              placeholder="Paste the job description here for a highly tailored interview."
            />
          </Form.Item>

          <Form.Item name="experience" label="Experience Summary (Optional)" className="col-span-1 md:col-span-2">
            <TextArea
              rows={4}
              placeholder="Briefly summarize your professional experience."
            />
          </Form.Item>

          <Form.Item name="projects" label="Key Projects (Optional)" className="col-span-1 md:col-span-2">
            <TextArea
              rows={4}
              placeholder="Describe 1-2 key projects you've worked on."
            />
          </Form.Item>

          <Form.Item className="col-span-1 md:col-span-2 mb-0 pt-4">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full !h-14 !text-lg"
            >
              Start Personalized Interview
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Modal
        title="Upload Your Resume"
        open={isUploadModalVisible}
        onCancel={() => setIsUploadModalVisible(false)}
        footer={null}
        destroyOnHidden
      >
        <ResumeUpload onUploadSuccess={() => setIsUploadModalVisible(false)} />
      </Modal>
    </div>
  );
};

export default ProfileForm;