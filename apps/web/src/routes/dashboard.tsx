import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '#/components/layout/sidebar/app-sidebar'
import Header from '#/components/layout/header'
import { CommandMenu } from '@/components/command-menu'

export const Route = createFileRoute('/dashboard')({
  staticData: {
    breadcrumb: 'Dashboard',
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <CommandMenu>
      <SidebarProvider>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <AppSidebar />
        <SidebarInset id="main-content" tabIndex={-1} className="h-svh overflow-hidden">
          <Header />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </CommandMenu>
  )
}
