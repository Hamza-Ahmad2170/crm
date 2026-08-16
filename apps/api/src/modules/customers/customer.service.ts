import {
  createCustomer,
  listCustomers,
  findCustomerById,
  updateCustomer,
  deleteCustomer,
  bulkDeleteCustomer,
} from "./customer.repository.js";
import type { CustomerListSchema } from "@repo/validators";
import { NotFoundError } from "@/lib/http/http-error.js";

import type { CreateCustomerInput, UpdateCustomerInput } from "@repo/validators";
import { getPaginationMeta } from "@/lib/pagination.js";

export async function createCustomerService(data: CreateCustomerInput) {
  return createCustomer(data);
}

export async function listCustomersService(data: CustomerListSchema) {
  const { rows, count } = await listCustomers(data);
  return {
    items: rows,
    pagination: getPaginationMeta(data.limit, data.offset, count),
  };
}

export async function findCustomerService(id: string) {
  const customer = await findCustomerById(id);

  if (!customer) {
    throw new NotFoundError("Customer not found", "CUSTOMER_NOT_FOUND");
  }

  return customer;
}

export async function updateCustomerService(
  id: string,
  data: UpdateCustomerInput,
) {
  const customer = await updateCustomer(id, data);

  if (!customer) {
    throw new NotFoundError("Customer not found", "CUSTOMER_NOT_FOUND");
  }

  return customer;
}

export async function bulkDeleteCustomerService(ids: string[]) {
  const customer = await bulkDeleteCustomer(ids);

  if (!customer) {
    throw new NotFoundError("Customer not found", "CUSTOMER_NOT_FOUND");
  }

  return customer;
}

export async function deleteCustomerService(id: string) {
  const customer = await deleteCustomer(id);

  if (!customer) {
    throw new NotFoundError("Customer not found", "CUSTOMER_NOT_FOUND");
  }

  return customer;
}
