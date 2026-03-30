import { logOut, refreshAccessToken } from '../../redux/slices/auth/authThunks';
import api from '../api';
import { AppDispatch } from '../../redux/store';
import { ROUTES } from '@/lib/routes';

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export const setInterceptors = (dispatch: AppDispatch) => {
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;

      if (!error.response) {
        return Promise.reject(error);
      }

      const isTokenError =
        error.response.status === 401 &&
        error.response.data?.message === 'Invalid or expired token';

      if (isTokenError && original._retry) {
        dispatch(logOut());
        window.location.replace(ROUTES.auth.login);
        return Promise.reject(error);
      }

      if (isTokenError && !original._retry) {
        original._retry = true;

        try {
          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = dispatch(refreshAccessToken()).unwrap();
          }

          await refreshPromise;
          isRefreshing = false;
          refreshPromise = null;

          return api(original); // retry original request
        } catch (err) {
          isRefreshing = false;
          refreshPromise = null;
          dispatch(logOut());
          window.location.replace(ROUTES.auth.login);
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );
};
