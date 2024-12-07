import { Route } from "next";

//----CUSTOM LINK----
export interface CustomLink {
  label: string;
  href: Route<string> | string;
  targetBlank?: boolean;
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
  adults: number;
  children: number;
}

export interface Destination {
  id: number;
  city: string;
  country: string;
  code: string;
  image: string;
  description?: string;
}

export interface PassengerInfo {
    firstName: string,
    lastName: string,
    phone: string,
    gender: string;
    dob: string
}

export interface FlightTicket {
  id: number;
  flight: Flight;
  passengers: PassengerInfo[];
  status: "Pending" | "Confirmed" | "Cancelled";
}


//----AIRPLANE----
export interface Airplane {
  id: number;
  modelName: string;
  manufacturer: string;
  serialNumber: string;
  registrationNumber: string;
  capacity: number;
  economySeats: number;
  businessSeats: number;
  firstClassSeats: number;
}

//----AIRPORT----
export interface Airport {
  id: number;
  code: string;
  city: string;
  country: string;
  name: string;
}


//----ARTICLE----
export interface Article {
  id: number;
  title: string;
  description: string;
  image: string;
}


