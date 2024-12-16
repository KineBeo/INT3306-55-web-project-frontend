import { components } from "@/types/api";

export type CreateAirport = components["schemas"]["CreateAirportDto"];
export type UpdateAirport = components["schemas"]["UpdateAirportDto"];

export interface Airport {
    id: number;
    code: string;
    name: string;
    city: string;
    country: string;
    created_at: string;
    updated_at: string;
};