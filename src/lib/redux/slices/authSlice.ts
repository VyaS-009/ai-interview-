import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the user information we might get from the token
interface UserProfile {
  email: string;
  // Add other user properties here if available from token
}

// Define a type for the slice state
interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: UserProfile | null;
}

// Define the initial state
const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set credentials after login
    setCredentials(
      state,
      action: PayloadAction<{ access_token: string; token_type: string }>
    ) {
      const { access_token } = action.payload;
      state.accessToken = access_token;
      state.isAuthenticated = true;
      // In a real app, you would decode the JWT here to get user info
      // For now, we'll leave the user object as null or derive from login
      // For example:
      // const decoded = jwt_decode(access_token); // using a library like jwt-decode
      // state.user = { email: decoded.sub };
    },
    // Action to log out
    logout(state) {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.user = null;
      // Also clear from localStorage if you are persisting it there
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
    },
    // New action to signal a full user session clear
    clearUserSession() {
      // This action just serves as a trigger for other slices to reset.
    },
  },
});

export const { setCredentials, logout, clearUserSession } = authSlice.actions;

export default authSlice.reducer;
