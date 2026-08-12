import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Link } from '@tanstack/react-router'
import { Fragment } from 'react'
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs'

export default function Breadcrumbs() {
  const items = useBreadcrumbs()

  if (items.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={item.link}>
              {index > 0 && (
                <span className="text-muted-foreground px-1">/</span>
              )}

              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={<Link to={item.link}>{item.title}</Link>}
                  />
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
