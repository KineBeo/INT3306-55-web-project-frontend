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