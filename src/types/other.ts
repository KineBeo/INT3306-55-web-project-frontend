import { Route } from "next";

//----CUSTOM LINK----
export interface CustomLink {
  label: string;
  href: Route<string> | string;
  targetBlank?: boolean;
}
export interface Destination {
  id: number;
  city: string;
  country: string;
  code?: string;
  image: string;
  description?: string;
}

