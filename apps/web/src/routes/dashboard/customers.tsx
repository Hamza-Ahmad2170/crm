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
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ context, deps: { search } }) => {
    context.queryClient.ensureQueryData(customersQueryOptions(search))
  },
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
