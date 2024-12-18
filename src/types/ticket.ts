import { components } from "@/types/api";
import { Flight } from "./flight";
import { UserInfo } from "./auth";
import { TicketPassenger } from "./ticketPassenger";

export type CreateTicket = components["schemas"]["CreateTicketDto"];
export type UpdateTicket = components["schemas"]["UpdateTicketDto"];

export interface Ticket {
    id: number;
    booking_date: string | null;
    ticket_type: "ONE_WAY" | "ROUND_TRIP";
    booking_class: "ECONOMY" | "BUSINESS" | "FIRST_CLASS";
    description: string;
    total_passengers: number;
    base_price: string;
    outbound_ticket_price: string;
    return_ticket_price: string;
    total_price: string;
    booking_status: "PENDING" | "CONFIRMED" | "CANCELLED";
    outboundFlight: Flight;
    returnFlight: Flight | null;
    user: UserInfo | null;
    ticketPassengers: TicketPassenger[];
    created_at: string;
    updated_at: string;
};