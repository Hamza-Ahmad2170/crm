import * as React from 'react'

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

import { Link } from '@tanstack/react-router'
import { Icons } from '@/components/icons'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import type { navGroups } from '@/config/nav-config'
import { isRouteActive } from './sidebar-nav'

type NavItem = (typeof navGroups)[number]['items'][number]

type SidebarNavItemProps = {
  item: NavItem
  Icon: React.ComponentType<{
    className?: string
  }>
  isActive: boolean
  pathname: string
}

export function SidebarNavItem({
  item,
  Icon,
  isActive,
  pathname,
}: SidebarNavItemProps) {
  const hasChildren = Boolean(item.items?.length)

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          isActive={isActive}
          render={
            <Link to={item.url} aria-label={item.title}>
              <Icon />
              <span>{item.title}</span>
            </Link>
          }
        />
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarNavCollapsibleItem
      item={item}
      Icon={Icon}
      isActive={isActive}
      pathname={pathname}
    />
  )
}

type SidebarNavCollapsibleItemProps = {
  item: NavItem
  Icon: React.ComponentType<{
    className?: string
  }>
  isActive: boolean
  pathname: string
}

function SidebarNavCollapsibleItem({
  item,
  Icon,
  isActive,
  pathname,
}: SidebarNavCollapsibleItemProps) {
  const hasActiveChild = item.items?.some((subItem) =>
    isRouteActive(pathname, subItem.url),
  )

  const [open, setOpen] = React.useState(
    item.isActive || isActive || Boolean(hasActiveChild),
  )

  React.useEffect(() => {
    if (isActive || hasActiveChild) {
      setOpen(true)
    }
  }, [isActive, hasActiveChild])

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton tooltip={item.title} isActive={isActive}>
              <Icon />

              <span>{item.title}</span>

              <Icons.chevronRight
                className="
                  ml-auto
                  transition-transform
                  duration-200
                  group-data-[expanded]/collapsible:rotate-90
                "
              />
            </SidebarMenuButton>
          }
        />

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => {
              const subItemActive = isRouteActive(pathname, subItem.url)

              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    isActive={subItemActive}
                    render={
                      <Link to={subItem.url} aria-label={subItem.title}>
                        <span>{subItem.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
