/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Numeric = ColumnType<string, number | string, number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Account {
  accessToken: string | null;
  accessTokenExpiresAt: Timestamp | null;
  accountId: string;
  createdAt: Timestamp;
  id: string;
  idToken: string | null;
  password: string | null;
  providerId: string;
  refreshToken: string | null;
  refreshTokenExpiresAt: Timestamp | null;
  scope: string | null;
  updatedAt: Timestamp;
  userId: string;
}

export interface Baskets {
  id: Generated<number>;
  menu_id: number;
  quantity: Generated<number>;
  user_id: string;
  variant_id: number;
}

export interface Menu {
  category_id: number;
  created_at: Generated<Timestamp>;
  deleted_at: Timestamp | null;
  description: string | null;
  id: Generated<number>;
  image: string | null;
  name: string;
  updated_at: Generated<Timestamp | null>;
}

export interface MenuCategories {
  id: Generated<number>;
  name: string;
}

export interface MenuOptions {
  id: Generated<number>;
  menu_id: number;
  name: string;
}

export interface MenuOptionValues {
  id: Generated<number>;
  menu_option_id: number;
  name: string;
}

export interface MenuVariantOptions {
  option_value_id: number;
  variant_id: number;
}

export interface MenuVariants {
  id: Generated<number>;
  menu_id: number;
  name: string;
  price: Numeric;
}

export interface OrderDetail {
  id: Generated<number>;
  menu_id: number;
  notes: string | null;
  order_id: string;
  price: Numeric;
  quantity: number;
  variant_id: number;
}

export interface Orders {
  created_at: Generated<Timestamp>;
  id: Generated<string>;
  status_id: number;
  token: Generated<string>;
  user_id: string;
}

export interface OrderStatus {
  id: Generated<number>;
  name: string;
}

export interface Session {
  createdAt: Timestamp;
  expiresAt: Timestamp;
  id: string;
  impersonatedBy: string | null;
  ipAddress: string | null;
  token: string;
  updatedAt: Timestamp;
  userAgent: string | null;
  userId: string;
}

export interface User {
  banExpires: Timestamp | null;
  banned: boolean | null;
  banReason: string | null;
  createdAt: Timestamp;
  email: string;
  emailVerified: boolean;
  id: string;
  image: string | null;
  name: string;
  role: string | null;
  updatedAt: Timestamp;
}

export interface Verification {
  createdAt: Timestamp | null;
  expiresAt: Timestamp;
  id: string;
  identifier: string;
  updatedAt: Timestamp | null;
  value: string;
}

export interface DB {
  account: Account;
  baskets: Baskets;
  menu: Menu;
  menu_categories: MenuCategories;
  menu_option_values: MenuOptionValues;
  menu_options: MenuOptions;
  menu_variant_options: MenuVariantOptions;
  menu_variants: MenuVariants;
  order_detail: OrderDetail;
  order_status: OrderStatus;
  orders: Orders;
  session: Session;
  user: User;
  verification: Verification;
}
