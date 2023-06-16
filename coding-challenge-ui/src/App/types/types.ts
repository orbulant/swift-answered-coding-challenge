import { GetByRole } from "@testing-library/react";

export enum ACTION {
  SET_USER = "set_user",
}

export type ReducerAction = {
  type: ACTION;
  payload: any;
};

export type ReducerState = {
  loggedInUser: User | null;
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  id: number;
};

export type Store = {
  storeId: string;
  marketplace: string;
  country: string;
  shopName: string;
};

export type Record = {
  Id: string;
  storeId: string;
  orderId: string;
  latest_ship_date: string;
  shipment_status: "Pending" | "Shipped";
  destination: string;
  items: string;
  orderValue: string;
  taxes: string;
  store: Store;
};

export type Totals = {
  sub_total: number;
  tax_total: number;
  total: number;
};
