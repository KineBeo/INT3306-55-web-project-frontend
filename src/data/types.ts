import { Route } from "@/routers/types";

//----CUSTOM LINK----
export interface CustomLink {
  label: string;
  href: Route<string> | string;
  targetBlank?: boolean;
}
