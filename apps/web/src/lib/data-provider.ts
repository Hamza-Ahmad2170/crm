import type { DataProvider } from "ra-core";
import { apiClient as client } from "./api-client";
import { parseResponse } from "hono/client";
import { combineDataProviders } from 'ra-core'
const resourceClients = {
  customers: client.api.v1.customers,
  plans: client.api.v1.plans,
  areas: client.api.v1.areas,
  invoices: client.api.v1.invoices,
  payments: client.api.v1.payments,
  tickets: client.api.v1.tickets,
  staff: client.api.v1.staff,
} as const;

type Resource = keyof typeof resourceClients;

function getResource(resource: Resources) {
  return resourceClients[resource];
}

export const dataProvider: DataProvider = {
  getList: async (resource: Resources, params) => {
    const { data } = await getResource(resource).
  },
};
