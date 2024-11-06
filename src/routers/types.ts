import type { Route } from "next";
import { ComponentType } from "react";

export type PathName = Route<string>;

export interface Page {
  path: PathName;
  exact?: boolean;
  component: ComponentType<object>;
}
