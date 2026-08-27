import type { NavGroup } from '@/types'

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Customers',
        url: '/dashboard/customers',
        isActive: false,
        icon: 'customers',
        items: [],
      },
    ],
  },
]
