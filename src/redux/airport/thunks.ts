/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading, setAirports, setError } from "./airportSlice";
import api from "@/services/apiClient";

export const fetchAirports = createAsyncThunk("/airport/", async (_, { dispatch }) => {
  dispatch(setLoading(true));
  try {
    const response = await api.get("/airport");
    dispatch(setAirports(response.data));
  } catch (error: any) {
    dispatch(setError(error.response.data.message));
    // throw error;
  } finally {
    dispatch(setLoading(false));
  }
});
