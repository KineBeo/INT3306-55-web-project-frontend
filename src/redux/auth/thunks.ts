/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginStart, loginSuccess, loginFailure, refreshTokenSuccess } from "./authSlice";
import api from "@/services/apiClient";

export const login = createAsyncThunk(
  "auth/login",
  async ({ phone_number, password }: { phone_number: string; password: string }, { dispatch }) => {
    dispatch(loginStart());
    try {
      const response = await api.post('/auth/login', { phone_number, password });
      dispatch(loginSuccess(response.data));
    } catch (error: any) {
      dispatch(loginFailure(error.response.data.message));
      throw error;
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { dispatch }) => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) throw new Error("No refresh token found");
      const response = await api.post('/auth/refresh', { refreshToken: refreshToken });
      dispatch(refreshTokenSuccess(response.data));
    } catch (error: any) {
      throw error;
    }
  }
);
