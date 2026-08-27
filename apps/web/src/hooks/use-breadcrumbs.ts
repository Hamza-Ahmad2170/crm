import { useLocation } from '@tanstack/react-router'
import { useMemo } from 'react'

export type BreadcrumbItem = {
  title: string
  link: string
}

const routeMapping: Partial<Record<string, BreadcrumbItem[]>> = {
  '/dashboard': [
    {
      title: 'Dashboard',
      link: '/dashboard',
    },
  ],

  '/customers': [
    {
      title: 'Customers',
      link: '/customers',
    },
  ],

  '/customers/active': [
    {
      title: 'Customers',
      link: '/customers',
    },
    {
      title: 'Active',
      link: '/customers/active',
    },
  ],

  '/settings': [
    {
      title: 'Settings',
      link: '/settings',
    },
  ],
}

export function useBreadcrumbs() {
  const { pathname } = useLocation()

  return useMemo(() => {
    // Use custom mapping when available
    if (routeMapping[pathname]) {
      return routeMapping[pathname]
    }

    // Fallback: generate breadcrumbs from URL
    const segments = pathname.split('/').filter(Boolean)

    return segments.map((segment, index) => ({
      title: formatSegment(segment),
      link: `/${segments.slice(0, index + 1).join('/')}`,
    }))
  }, [pathname])
}

function formatSegment(segment: string) {
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
