"use client";

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '@/lib/redux/store';
import { Spin } from 'antd';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace('/login');
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return (
        <div className="flex h-screen w-full items-center justify-center"><Spin size="large" /></div>
      );
    }

    return <WrappedComponent {...props} />;
  };
  return AuthComponent;
};

export default withAuth;