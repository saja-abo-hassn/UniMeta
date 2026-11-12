/**
 * UI primitives for UniMeta platform shells, navigation, and service states.
 */

export type AreaId = "public" | "student" | "admin";

export interface Destination {
  id: string;
  title: string;
  area: AreaId;
  path: string;
  description: string;
  badge?: string;
  icon?: string;
}

export type ServiceStateCategory =
  | "loading"
  | "empty"
  | "error"
  | "unauthorized" // 401
  | "forbidden"    // 403
  | "not-found"    // 404
  | "conflict"     // 409
  | "validation"   // 422
  | "offline";

export interface StateAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface StatePanelProps {
  category: ServiceStateCategory;
  title?: string;
  description?: string;
  action?: StateAction;
  details?: string[];
  className?: string;
}

