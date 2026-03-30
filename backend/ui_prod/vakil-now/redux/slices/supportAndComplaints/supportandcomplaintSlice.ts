import { createSlice } from '@reduxjs/toolkit';
import {
  fetchClosedTickets,
  fetchOpenTickets,
  raiseTicket
} from './supportandcomplaintThunk';

interface Ticket {
  id: number;
  title: string;
  query: string;
  status: string;
  createdAt: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
}

interface TicketState {
  openTickets: Ticket[];
  closedTickets: Ticket[];
  openPagination: Pagination | null;
  closedPagination: Pagination | null;
  openPage: number;
  closedPage: number;
  loadingOpen: boolean;
  loadingClosed: boolean;
  raiseLoading: boolean;
  raiseSuccess: boolean;
  openError?: string | null;
  closedError?: string | null;
  openInitialLoad: boolean; // Track initial load
  closedInitialLoad: boolean; // Track initial load
  isRefreshingOpen: boolean;
  isRefreshingClosed: boolean;
}
const initialState: TicketState = {
  openTickets: [],
  closedTickets: [],
  openPagination: null,
  closedPagination: null,
  openPage: 1,
  closedPage: 1,
  loadingOpen: false,
  loadingClosed: false,
  raiseLoading: false,
  raiseSuccess: false,
  openError: null,
  closedError: null,
  openInitialLoad: false,
  closedInitialLoad: false,
  isRefreshingOpen: false,
  isRefreshingClosed: false
};

const supportAndComplaintSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetSupportState: () => initialState,
    resetOpenTickets: (state) => {
      state.openTickets = [];
      state.openPage = 1;
      state.openPagination = null;
      // state.openInitialLoad = false;
    },
    resetClosedTickets: (state) => {
      state.closedTickets = [];
      state.closedPage = 1;
      state.closedPagination = null;
      // state.closedInitialLoad = false;
    },
    // Add refresh action
    refreshOpenTickets: (state) => {
      state.isRefreshingOpen = true;
      state.openTickets = [];
      state.openPage = 1;
    },
    refreshClosedTickets: (state) => {
      state.isRefreshingClosed = true;
      state.closedTickets = [];
      state.closedPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpenTickets.pending, (state) => {
        state.loadingOpen = true;
        state.openError = null;
      })
      .addCase(fetchOpenTickets.fulfilled, (state, action) => {
        state.loadingOpen = false;
        state.openInitialLoad = true;
        if (action.payload.pagination.page === 1) {
          state.openTickets = action.payload.data;
        } else {
          // Otherwise, append to existing tickets
          state.openTickets = [...state.openTickets, ...action.payload.data];
        }

        state.openPagination = action.payload.pagination;
        // Set next page number
        state.openPage = action.payload.pagination.page + 1;
      })
      .addCase(fetchOpenTickets.rejected, (state, action) => {
        state.loadingOpen = false; // ✅ VERY IMPORTANT
        state.openError = action.error.message || 'Failed to load open tickets';
      })

      .addCase(fetchClosedTickets.pending, (state) => {
        state.loadingClosed = true;
        state.closedError = null;
      })
      .addCase(fetchClosedTickets.fulfilled, (state, action) => {
        state.loadingClosed = false;
        state.closedInitialLoad = true;
        if (action.payload.pagination.page === 1) {
          state.closedTickets = action.payload.data;
        } else {
          // Otherwise, append to existing tickets
          state.closedTickets = [
            ...state.closedTickets,
            ...action.payload.data
          ];
        }
        state.closedPagination = action.payload.pagination;
        // Set next page number
        state.closedPage = action.payload.pagination.page + 1;
      })
      .addCase(fetchClosedTickets.rejected, (state, action) => {
        state.loadingClosed = false; // ✅ VERY IMPORTANT
        state.closedError =
          action.error.message || 'Failed to load closed tickets';
      })

      .addCase(raiseTicket.pending, (state) => {
        state.raiseLoading = true;
        state.raiseSuccess = false;
      })
      .addCase(raiseTicket.fulfilled, (state) => {
        state.raiseLoading = false;
        state.raiseSuccess = true;

        // reset pagination so list reloads from page 1
        state.openTickets = [];
        state.openPage = 1;
      })
      .addCase(raiseTicket.rejected, (state) => {
        state.raiseLoading = false;
      });
  }
});

export const {
  resetSupportState,
  resetOpenTickets,
  resetClosedTickets,
  refreshOpenTickets,
  refreshClosedTickets
} = supportAndComplaintSlice.actions;
export default supportAndComplaintSlice.reducer;
