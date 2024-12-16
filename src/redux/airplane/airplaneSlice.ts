import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Airplane } from "@/data/airplane";

interface AirplaneState {
  airplanes: Airplane[];
  loading: boolean;
  error: string | null;
}

const initialState: AirplaneState = {
  airplanes: [],
  loading: false,
  error: null,
};

const airplaneSlice = createSlice({
  name: "airplane",
  initialState,
  reducers: {
    setAirplanes(state, action: PayloadAction<Airplane[]>) {
          state.airplanes = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setAirplanes, setLoading, setError } = airplaneSlice.actions;

export default airplaneSlice.reducer;