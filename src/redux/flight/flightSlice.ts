import { Flight } from '@/types/flight';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FlightState {
  flights: Flight[];
  loading: boolean;
  error: string | null;
}

const initialState: FlightState = {
  flights: [],
  loading: false,
  error: null,
};

const flightSlice = createSlice({
  name: "flight",
  initialState,
  reducers: {
    setFlights(state, action: PayloadAction<Flight[]>) {
      state.flights = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setFlights, setLoading, setError } = flightSlice.actions;

export default flightSlice.reducer;