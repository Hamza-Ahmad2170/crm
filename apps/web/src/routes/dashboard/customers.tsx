import { createFileRoute } from '@tanstack/react-router'
import PageContainer from '@/components/layout/page-container'
import { customersQueryOptions } from '@/features/customers/api'
import CustomersListingPage from '@/features/customers/components/customers-listing'
import { customerListSchema } from '@repo/schema'

export const Route = createFileRoute('/dashboard/customers')({
  staticData: {
    breadcrumb: 'Customers',
  },
  validateSearch: customerListSchema,
  loader: async ({ context }) =>
    context.queryClient.ensureQueryData(
      customersQueryOptions({
        limit: 20,
        offset: 0,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      }),
    ),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageContainer
      title="Customers"
      description="Manage your customer relationships."
    >
      <CustomersListingPage />
    </PageContainer>
  )
}
