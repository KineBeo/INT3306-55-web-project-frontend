import { Route } from "@/routers/types";
import { StaticImageData } from "next/image";

//----CUSTOM LINK----
export interface CustomLink {
  label: string;
  href: Route<string> | string;
  targetBlank?: boolean;
}
