import { components } from "@/types/api";
import { Airport } from "./airport";
import { Airplane } from "./airplane";

export type CreateFlight = components["schemas"]["CreateFlightDto"];
export type UpdateFlight = components["schemas"]["UpdateFlightDto"];

export interface Flight {
    id: number;
    flight_number: string;
    base_price: string;
    departure_time: string;
    arrival_time: string;
    duration: string;
    delay_duration: string;
    status: "SCHEDULED" | "DELAYED" | "CANCELLED" | "COMPLETED";
    created_at: string;
    updated_at: string;
    departure_airport: Airport;
    arrival_airport: Airport;
    airplane: Airplane;
};