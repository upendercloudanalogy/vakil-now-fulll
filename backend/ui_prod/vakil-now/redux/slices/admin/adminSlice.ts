import { createSlice } from '@reduxjs/toolkit';
import {
  adminDashboardCardDetails,
  adminDashboardUserLawyerGrowthData,
  fetchOpenTickets
} from './adminThunk';

interface UserGrowthDataPoint {
  year: number;
  client: number;
  lawyer: number;
}

interface InitialState {
  dashboardCardDetails: {
    totalLawyers: number;
    totalUsers: number;
    totalServices: number;
    totalActivePackages: number;
  };
  graphData: UserGrowthDataPoint[];
  newTickets: number;
  pendingTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  loading: boolean;
  error: string | null; // <--- FIX TYPE
}

const initialState: InitialState = {
  dashboardCardDetails: {
    totalLawyers: 0,
    totalUsers: 0,
    totalServices: 0,
    totalActivePackages: 0
  },
  graphData: [],
  newTickets: 0,
  pendingTickets: 0,
  inProgressTickets: 0,
  resolvedTickets: 0,
  error: null,
  loading: false
};

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminDashboardCardDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminDashboardCardDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardCardDetails.totalLawyers =
          action.payload.data.totalLawyers;
        state.dashboardCardDetails.totalActivePackages =
          action.payload.data.activePackages;
        state.dashboardCardDetails.totalServices =
          action.payload.data.totalServices;
        state.dashboardCardDetails.totalUsers = action.payload.data.totalUsers;
      })
      .addCase(adminDashboardCardDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      });

    builder
      .addCase(adminDashboardUserLawyerGrowthData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        adminDashboardUserLawyerGrowthData.fulfilled,
        (state, action) => {
          state.loading = false;
          state.graphData = action.payload;
        }
      )
      .addCase(adminDashboardUserLawyerGrowthData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      .addCase(fetchOpenTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpenTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.newTickets = action.payload.data?.newTickets;
        state.pendingTickets = action.payload.data?.pendingTickets;
        state.inProgressTickets = action.payload.data?.inProgressTickets;
        state.resolvedTickets = action.payload.data?.resolvedTickets;
      })
      .addCase(fetchOpenTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      });
  }
});

export default adminDashboardSlice.reducer;
