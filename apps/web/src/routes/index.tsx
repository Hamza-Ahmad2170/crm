import { createFileRoute } from "@tanstack/react-router";
import { Resource } from "ra-core";
import { tanStackRouterProvider } from "ra-router-tanstack";

import { Admin } from "@/components/admin";
import { dataProvider } from "#/lib/data-provider";
import { CustomersList } from "#/features/customers";

export const Route = createFileRoute("/")({ component: App });

export function App() {
  return (
    <Admin
      title="CRM"
      dataProvider={dataProvider}
      routerProvider={tanStackRouterProvider}
    >
      <Resource name="customers" list={CustomersList} />
    </Admin>
  );
}
