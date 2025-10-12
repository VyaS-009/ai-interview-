"use client";
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Form, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLoginMutation, useRegisterMutation } from '@/lib/api/interviewApi';
import { setCredentials } from '@/lib/redux/slices/authSlice';

const { Title } = Typography;

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const [form] = Form.useForm();

  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading, error: registerError }] = useRegisterMutation();

  const title = mode === 'login' ? 'Log In' : 'Sign Up';
  const buttonText = mode === 'login' ? 'Log In' : 'Create Account';
  const isLoading = isLoginLoading || isRegisterLoading;

  useEffect(() => {
    const apiError = loginError || registerError;
    if (apiError) {
        if ('data' in apiError) {
            const errorData = apiError.data as { detail?: string };
            setError(errorData.detail || `Failed to ${mode}.`);
        } else {
            setError(`An unknown error occurred.`);
        }
    }
  }, [loginError, registerError, mode]);

  const onFinish = async (values: { email: string; password: string }) => {
    setError(null);
    const credentials = { username: values.email, password: values.password };

    try {
      if (mode === 'login') {
        const data = await login(credentials).unwrap();
        dispatch(setCredentials(data));
      } else {
        await register(credentials).unwrap();
        // Automatically log in the user after successful registration
        const data = await login(credentials).unwrap();
        dispatch(setCredentials(data));
      }
      router.push('/');
    } catch (err) {
      // Error is now handled by the useEffect hook
      console.error(`Failed to ${mode}:`, err);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>{title}</Title>
        <Form
          form={form}
          name="auth_form"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!', type: 'email' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          {mode === 'signup' && (
            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
            </Form.Item>
          )}

          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '24px' }} />}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} style={{ width: '100%' }}>
              {buttonText}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            {mode === 'login' ? (
              <>
                Don&apos;t have an account? <Link href="/signup">Sign up</Link>
              </>
            ) : (
              <>
                Already have an account? <Link href="/login">Log in</Link>
              </>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
}

