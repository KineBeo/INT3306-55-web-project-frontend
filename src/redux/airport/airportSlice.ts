import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Airport } from "@/types/airport";

interface AirportState {
  airports: Airport[];
  loading: boolean;
  error: string | null;
}

const initialState: AirportState = {
  airports: [],
  loading: false,
  error: null,
};

const airportSlice = createSlice({
  name: "airport",
  initialState,
  reducers: {
    setAirports(state, action: PayloadAction<Airport[]>) {
      state.airports = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setAirports, setLoading, setError } = airportSlice.actions;

export default airportSlice.reducer;