import { Route } from "next";

//----CUSTOM LINK----
export interface CustomLink {
  label: string;
  href: Route<string> | string;
  targetBlank?: boolean;
}

export interface NewsData {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface Flight {
  id: number;
  departureDate: string;
  arrivalDate: string;
  departureTime: string;
  arrivalTime: string;
  totalTime: string;
  sectors: string[];
  sectorsCode: string[];
  price: number;
  aircraftModel: string;
  flightCode: string;
  class: string;
  passengers: number;
}