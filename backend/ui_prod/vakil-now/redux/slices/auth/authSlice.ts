import { createSlice } from '@reduxjs/toolkit';
import {
  getUser,
  logOut,
  refreshAccessToken,
  signupUser,
  verifyOtp
} from './authThunks';

interface AuthState {
  user: {
    phone: string;
    type?: string;
  };
  loading: boolean;
  error: string | null; // <--- FIX TYPE
  isAuthenticated: boolean;
  isOtpSend: boolean;
  accessToken?: string;
  refreshToken?: string;
}

const initialState: AuthState = {
  user: {
    phone: '',
    type: ''
  },
  loading: true,
  error: null,
  isAuthenticated: false,
  isOtpSend: false,
  accessToken: '',
  refreshToken: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user.phone = action.payload.phone;
        state.isOtpSend = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(logOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.loading = false;
        ((state.user.phone = ''),
          (state.user.type = ''),
          (state.isAuthenticated = false),
          (state.isOtpSend = false));
      })
      .addCase(logOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user.phone = action.payload.user.phone;
        state.user.type = action.payload.user.type;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        // You can store the token or user info as needed
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      .addCase(getUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user.phone = action.payload.data.phone;
        state.user.type = action.payload.data.type;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload ?? null;
      })

      .addCase(refreshAccessToken.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload ?? null;
      });
  }
});

export default authSlice.reducer;
