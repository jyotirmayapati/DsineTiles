// Shared TypeScript types for the application

export interface ProductConfig {
  type: string;
  l_label?: string;
  w_label?: string;
  t_label?: string;
  t_options?: number[] | null;
}

export interface FormInputs {
  quantity?: number;
  dim1?: number;
  dim2?: number;
  thickness?: number;
  [key: string]: number | undefined;
}

export type ProductType =
  | "Solid Block"
  | "Paver"
  | "Kerbstone"
  | "Saucer Drain"
  | "U Drain"
  | "Precast Slab"
  | "Boundary Wall Panel"
  | "Precast Road";

export type ConcreteGrade = "M7.5" | "M25" | "M30" | "M35" | "M40";
