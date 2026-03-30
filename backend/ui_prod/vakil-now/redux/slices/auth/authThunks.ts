import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../axios/api';
import { API_PATHS } from '../../apiPaths';

export const signupUser = createAsyncThunk<
  { phone: string; type: string }, // SUCCESS payload type
  { phone: string; type: string }, // argument type
  { rejectValue: string } // ERROR payload type
>('auth/signupByPhone', async ({ phone, type }, { rejectWithValue }) => {
  try {
    const res = await api.post(API_PATHS.AUTH.SIGNUP, { phone, type });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      Array.isArray(err.response?.data?.message)
        ? err.response.data.message[0]
        : err.response?.data?.message || err.message
    );
  }
});

export const verifyOtp = createAsyncThunk<
  {
    message: string;
    user: {
      name: string | null;
      phone: string;
      type: string;
    };
    accessToken: string;
    refreshToken: string;
    typeEncoded: string;
  }, // SUCCESS payload type
  { userPhone: string; otp: string; type: string }, // argument type
  { rejectValue: string } // ERROR payload type
>('auth/verifyOtp', async ({ userPhone, otp, type }, { rejectWithValue }) => {
  try {
    const phone = userPhone;
    const res = await api.post(API_PATHS.AUTH.VERIFY_OTP, { phone, otp, type });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data.message || err.message);
  }
});

export const getUser = createAsyncThunk<any, void, { rejectValue: string }>(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('user/me');
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

export const refreshAccessToken = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>('auth/refreshAccessToken', async (_, { rejectWithValue }) => {
  try {
    const res = await api.post(API_PATHS.AUTH.REFRESH_TOKEN);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || error?.message);
  }
});

export const logOut = createAsyncThunk<any, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post(API_PATHS.AUTH.LOGOUT);
      return res?.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.message);
    }
  }
);
