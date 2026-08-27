import { Suspense } from 'react'
import { CustomersTable, CustomersTableSkeleton } from './customers-table'

export default function CustomersListingPage() {
  return (
    <Suspense fallback={<CustomersTableSkeleton />}>
      <CustomersTable />
    </Suspense>
  )
}
