import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../axios/api';
import { API_PATHS } from '../../apiPaths';

export const adminDashboardCardDetails = createAsyncThunk<
  any,
  void,
  { rejectValue: any }
>('/admin/dashboard-card-details', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get(API_PATHS.ADMIN.DASHBOARD_CARDS);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'something went wrong'
    );
  }
});

export const adminDashboardUserLawyerGrowthData = createAsyncThunk<
  any,
  void,
  { rejectValue: any }
>('admin/growth-graph-data', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get(API_PATHS.ADMIN.GROWTH_GRAPH);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'something went wrong'
    );
  }
});

export const fetchOpenTickets = createAsyncThunk<
  any, // return type
  void, // argument type (no args)
  { rejectValue: string }
>('admin/support-tickets-counts', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get(API_PATHS.ADMIN.SUPPORT_COUNTS);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'something went wrong'
    );
  }
});


export const fetchLawyersRequests = createAsyncThunk<
  any, // return type
  void, // argument type (no args)
  { rejectValue: string }
  >('admin/lawyer-requests', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get(API_PATHS.ADMIN.LAWYER_REQUESTS);
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'something went wrong'
    );
  }
});
