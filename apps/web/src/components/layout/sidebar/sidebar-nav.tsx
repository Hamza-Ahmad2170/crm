import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar'

import { useLocation } from '@tanstack/react-router'
import { Icons } from '@/components/icons'
import { navGroups } from '@/config/nav-config'

import { SidebarNavItem } from './sidebar-nav-item'

function isRouteActive(pathname: string, url: string) {
  return pathname === url || pathname.startsWith(`${url}/`)
}

export function SidebarNav() {
  const { pathname } = useLocation()

  return (
    <>
      {navGroups.map((group) => (
        <SidebarGroup key={group.label} className="py-0">
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

          <SidebarMenu>
            {group.items.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo

              const hasChildren = Boolean(item.items?.length)

              const isActive = hasChildren
                ? isRouteActive(pathname, item.url) ||
                  item.items!.some((subItem) =>
                    isRouteActive(pathname, subItem.url),
                  )
                : isRouteActive(pathname, item.url)

              return (
                <SidebarNavItem
                  key={item.title}
                  item={item}
                  Icon={Icon}
                  isActive={isActive}
                  pathname={pathname}
                />
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}

export { isRouteActive }
