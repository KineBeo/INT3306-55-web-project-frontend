/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading, setAirplanes, setError } from "./airplaneSlice";
import api from "@/services/apiClient";

export const fetchAirplanes = createAsyncThunk("/airplane/", async (_, { dispatch }) => {
  dispatch(setLoading(true));
  try {
    const response = await api.get("/airplane");
    dispatch(setAirplanes(response.data));
  } catch (error: any) {
    dispatch(setError(error.response.data.message));
    // throw error;
  } finally {
    dispatch(setLoading(false));
  }
});
