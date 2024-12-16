/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading, setFlights, setError } from "./flightSlice";
import api from "@/services/apiClient";

export const fetchFlights = createAsyncThunk("/flight/", async (_, { dispatch }) => {
  dispatch(setLoading(true));
  try {
    const response = await api.get("/flight");
    dispatch(setFlights(response.data));
  } catch (error: any) {
    dispatch(setError(error.response.data.message));
    // throw error;
  } finally {
    dispatch(setLoading(false));
  }
});
