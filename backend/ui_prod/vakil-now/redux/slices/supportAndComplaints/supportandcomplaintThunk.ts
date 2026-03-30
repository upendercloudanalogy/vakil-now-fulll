import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../axios/api';
import { API_PATHS } from '../../apiPaths';

export const fetchClosedTickets = createAsyncThunk(
  'support/fetchClosedTickets',
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(
        `${API_PATHS.SUPPORT.CLOSED_TICKETS}?page=${page}&limit=${limit}`
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch closed ticket'
      );
    }
  }
);

export const fetchOpenTickets = createAsyncThunk(
  'support/fetchOpenTickets',
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(
        `${API_PATHS.SUPPORT.OPEN_TICKETS}?page=${page}&limit=${limit}`
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch open ticket'
      );
    }
  }
);

export const raiseTicket = createAsyncThunk(
  'support/raiseTicket',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post(API_PATHS.SUPPORT.RAISE_TICKET, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to raise ticket'
      );
    }
  }
);
