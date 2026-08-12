import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import Breadcrumbs from '@/components/breadcrumbs'
import { ModeToggle } from '../mode-toggle'
import SearchInput from '../search-input'

export default function Header() {
  return (
    <header className="bg-background/60 sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 rounded-t-xl border-b backdrop-blur-md px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4 mt-1.5" />
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2">
        <SearchInput />
        <ModeToggle />
      </div>
    </header>
  )
}
