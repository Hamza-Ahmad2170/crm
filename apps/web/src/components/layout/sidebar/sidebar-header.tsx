import {
  SidebarHeader as SidebarHeaderPrimitive,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Icons } from '@/components/icons'

export function SidebarHeader() {
  return (
    <SidebarHeaderPrimitive>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            render={
              <Link to="/dashboard" aria-label="Dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-md">
                  <Icons.logo className="size-4" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TanStack Start</span>

                  <span className="text-muted-foreground truncate text-xs">
                    Dashboard
                  </span>
                </div>
              </Link>
            }
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeaderPrimitive>
  )
}
