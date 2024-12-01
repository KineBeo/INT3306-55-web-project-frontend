import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Flight } from "@/data/types";

interface FlightState {
  selectedFlight: Flight | null;
}

const initialState: FlightState = {
  selectedFlight: null,
};

const flightSlice = createSlice({
  name: "flight",
  initialState,
  reducers: {
    setFlight(state, action: PayloadAction<Flight>) {
      state.selectedFlight = action.payload;
    },
    clearFlight(state) {
      state.selectedFlight = null;
    },
  },
});

export const { setFlight, clearFlight } = flightSlice.actions;
export default flightSlice.reducer;
