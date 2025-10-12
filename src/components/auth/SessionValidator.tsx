"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetInterviewHistoryQuery } from '@/lib/api/interviewApi';
import { logout, clearUserSession } from '@/lib/redux/slices/authSlice';
import { RootState } from '@/lib/redux/store';

const SessionValidator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // This query will automatically run on component mount if the user is authenticated.
  const { error } = useGetInterviewHistoryQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    // If the query results in a 401/403 error, the token is invalid.
    if (error && 'status' in error && (error.status === 401 || error.status === 403)) {
      dispatch(logout());
      dispatch(clearUserSession());
    }
  }, [error, dispatch]);

  return null; // This component does not render anything.
};

export default SessionValidator;