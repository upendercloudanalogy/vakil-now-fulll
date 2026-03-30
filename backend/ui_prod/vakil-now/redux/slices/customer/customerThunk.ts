import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../axios/api';
import { API_PATHS } from '../../apiPaths';

export interface UserProfile {
  id: string;
  companyName: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role: string;
  address?: string;
  createdAt: string;
}

export const getUserProfile = createAsyncThunk<
  UserProfile, // success type
  void, // no params
  { rejectValue: string } // reject type
>('/user/profile', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get(API_PATHS.USER.ME);
    return res.data.data as UserProfile;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'Something went wrong'
    );
  }
});
