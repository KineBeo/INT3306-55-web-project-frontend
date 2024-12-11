import { components } from "@/types/api";
import { Ticket } from "./ticket";

export type CreateTicketPassenger = components["schemas"]["CreateTicketPassengerDto"];
export type UpdateTicketPassenger = components["schemas"]["UpdateTicketPassengerDto"];

export interface TicketPassenger {
    id: number;
    passenger_type: "ADULT" | "CHILD" | "INFANT";
    full_name: string;
    birthday: string;
    cccd: string;
    country_code: string;
    created_at: string;
    updated_at: string;
    ticket: Ticket;
    
};