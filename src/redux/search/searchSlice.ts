import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  fromLocation: string;
  toLocation: string;
  outboundDate: string;
  returnDate: string;
  ticketType: "ONE_WAY" | "ROUND_TRIP";
  flightClass: "ECONOMY" | "BUSINESS" | "FIRST_CLASS";
  adults: number;
  children: number;
  infants: number;
}

const initialState: SearchState = {
  fromLocation: "",
  toLocation: "",
  outboundDate: "",
  returnDate: "",
  ticketType: "ONE_WAY",
  flightClass: "ECONOMY",
  adults: 1,
  children: 0,
  infants: 0,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<SearchState>) {
      state.fromLocation = action.payload.fromLocation;
      state.toLocation = action.payload.toLocation;
      state.outboundDate = action.payload.outboundDate;
      state.returnDate = action.payload.returnDate;
      state.ticketType = action.payload.ticketType;
      state.flightClass = action.payload.flightClass;
      state.adults = action.payload.adults;
      state.children = action.payload.children;
      state.infants = action.payload.infants;
    },
    clearSearch(state) {
      state.fromLocation = "";
      state.toLocation = "";
      state.outboundDate = "";
      state.returnDate = "";
      state.ticketType = "ONE_WAY";
      state.flightClass = "ECONOMY";
      state.adults = 1;
      state.children = 0;
      state.infants = 0;
    },
  },
});

export const {
  setSearch,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
