"use client"
import { Card, Form, Input, Button, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  updateCandidateInfo,
  setInterviewStatus,
} from "@/lib/redux/slices/interviewSlice";
import { useEffect } from "react";

const InfoCollection: React.FC = () => {
  const dispatch = useDispatch();
  const missingInfo = useSelector(
    (state: RootState) => state.interview.missingInfo
  );
  const candidateInfo = useSelector(
    (state: RootState) => state.interview.candidateInfo
  );
  const [form] = Form.useForm();

  useEffect(() => {
    if (!missingInfo?.length) {
      dispatch(setInterviewStatus("in-progress"));
    }
  }, [missingInfo, dispatch]);

  const currentField = missingInfo?.[0];

  const onFinish = (values: { value: string }) => {
    if (currentField) {
      dispatch(
        updateCandidateInfo({ field: currentField, value: values.value })
      );
      form.resetFields();
      message.success(`${currentField} updated successfully!`);
    }
  };

  if (!currentField) return null;

  return (
    <Card title={`Please provide your ${currentField}`}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="value"
          label={currentField.charAt(0).toUpperCase() + currentField.slice(1)}
          rules={[
            { required: true, message: `Please enter your ${currentField}` },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default InfoCollection;
