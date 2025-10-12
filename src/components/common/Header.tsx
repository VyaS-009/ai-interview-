"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
import { LogoutOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { RootState } from '@/lib/redux/store';
import { logout, clearUserSession } from '@/lib/redux/slices/authSlice';
import { interviewApi } from '@/lib/api/interviewApi';
import { resetInterview } from '@/lib/redux/slices/interviewSlice';

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { interviewStatus } = useSelector((state: RootState) => state.interview);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUserSession()); // Dispatch the new action to fully clear user data
    dispatch(interviewApi.util.resetApiState()); // Clear the RTK Query cache
    router.push('/login');
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (interviewStatus !== 'not-started') {
      e.preventDefault(); // Prevent default navigation
      dispatch(resetInterview());
      router.push('/');
    }
  };

  return (
    <header className="bg-white/30 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"
            >
              AI-Interview
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  type="default"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button icon={<LoginOutlined />}>Login</Button>
                </Link>
                <Link href="/signup" passHref>
                  <Button type="primary" icon={<UserAddOutlined />}>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;