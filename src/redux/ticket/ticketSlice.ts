import { Ticket } from "@/data/ticket";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TicketState {
  tickets: Ticket[];
  adults: number;
  children: number;
  infants: number;
  totalPrice: number;
}

const initialState: TicketState = {
  tickets: [],
  adults: 0,
  children: 0,
  infants: 0,
  totalPrice: 0,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    setTicket(state, action: PayloadAction<Ticket[]>) {
      state.tickets = action.payload;
    },
    setPassengers(state, action: PayloadAction<{ adults: number; children: number; infants: number }>) {
      state.adults = action.payload.adults;
      state.children = action.payload.children;
      state.infants = action.payload.infants;
    },
    setTotalPrice(state, action: PayloadAction<number>) {
      state.totalPrice = action.payload;
    },
    clearTicket(state) {
      state.tickets = [];
    },
    clearPassengers(state) {
      state.adults = 0;
      state.children = 0;
      state.infants = 0;
    },
    clearTotalPrice(state) {
      state.totalPrice = 0;
    }
  },
});

export const { setTicket, setPassengers,setTotalPrice, clearTicket, clearPassengers, clearTotalPrice } = ticketSlice.actions;

export default ticketSlice.reducer;