import { components } from "@/types/api";
import { Flight } from "./flight";

export type CreateTicket = components["schemas"]["CreateTicketDto"];
export type UpdateTicket = components["schemas"]["UpdateTicketDto"];
export type BookTicket = components["schemas"]["BookTicketDto"];

export interface Ticket {
    id: number;
    booking_date: string;
    ticket_type: string;
    booking_class: "ECONOMY" | "BUSINESS" | "FIRST_CLASS";
    booking_seat_code: string;
    description: string;
    total_passengers: number;
    base_price: string;
    outbound_ticket_price: string;
    return_ticket_price: string;
    total_price: string;
    booking_status: "PENDING" | "CONFIRMED" | "CANCELLED";
    created_at: string;
    updated_at: string;
};

export interface TicketSearch extends Ticket {
    outboundFlight: Flight;
    returnFlight: Flight;
};

export interface TicketSearchByOutboundTime extends Ticket {
    outboundFlight: Flight;
};