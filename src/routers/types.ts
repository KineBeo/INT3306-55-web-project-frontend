import type { Route as NextRoute } from "next";
import { ComponentType } from "react";

export type PathName = NextRoute;

export interface Page {
  path: PathName;
  exact?: boolean;
  component: ComponentType<object>;
}
