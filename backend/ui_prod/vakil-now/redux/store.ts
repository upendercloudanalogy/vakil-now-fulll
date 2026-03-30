import { combineReducers, configureStore } from '@reduxjs/toolkit';
import auth from './slices/auth/authSlice';
import adminDashboardSlice from './slices/admin/adminSlice';
import { setInterceptors } from '../axios/interceptors/response.interceptor';
import supportAndComplaintSlice from './slices/supportAndComplaints/supportandcomplaintSlice';
import userReducer from './slices/customer/customerSlice';
import llpReducer from './slices/llp/llpSlice';
import announcementReducer from './slices/announcement/announcementSlice';
import lawyerOnboardingReducer from './slices/lawyer/lawyerSlice';

const rootReducer = combineReducers({
  auth,
  adminDashboardSlice,
  supportAndComplaintSlice,
  userReducer,
  llpReducer,
  announcementReducer,
  lawyerOnboardingReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // because axios adds non-serializable data
    })
});

setInterceptors(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
