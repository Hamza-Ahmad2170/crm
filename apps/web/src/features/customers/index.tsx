import { DataTable, List } from "@/components/admin";

export const CustomersList = () => (
  <List>
    <DataTable>
      <DataTable.Col source="id" />
      <DataTable.Col source="name" />
      <DataTable.Col source="username" />
      <DataTable.Col source="email" />
      <DataTable.Col source="address.street" />
      <DataTable.Col source="phone" />
      <DataTable.Col source="website" />
      <DataTable.Col source="company.name" />
    </DataTable>
  </List>
);
