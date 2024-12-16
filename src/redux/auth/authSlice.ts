import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, LoginResponse, RefreshTokenResponse } from "@/data/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.isAuthenticated = true;
      state.error = null;

      // Lưu vào localStorage
      localStorage.setItem("access_token", action.payload.access_token);
      localStorage.setItem("refresh_token", action.payload.refresh_token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // Xóa khỏi localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
    refreshTokenSuccess: (state, action: PayloadAction<RefreshTokenResponse>) => {
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;

      // Cập nhật localStorage
      localStorage.setItem("access_token", action.payload.access_token);
      localStorage.setItem("refresh_token", action.payload.refresh_token);
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  refreshTokenSuccess,
} = authSlice.actions;

export default authSlice.reducer;
