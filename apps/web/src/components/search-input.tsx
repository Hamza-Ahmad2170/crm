import { useCommandMenu } from '@/components/command-menu'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'

/**
 * Search trigger shown in the header.
 *
 * - On `md` and up: an inline button styled like a search input (with a ⌘K hint).
 * - Below `md`: an icon-only button.
 *
 * Both open the command palette via the {@link useCommandMenu} context.
 */
export default function SearchInput() {
  const { toggle } = useCommandMenu()

  return (
    <>
      {/* Desktop: inline trigger that looks like a search field */}
      <Button
        variant="outline"
        onClick={toggle}
        className="text-muted-foreground hidden h-9 w-full justify-start gap-2 text-sm font-normal md:flex md:w-48 lg:w-64"
      >
        <Icons.search />
        <span className="truncate">Search...</span>
        <kbd className="bg-muted text-muted-foreground pointer-events-none ml-auto hidden h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] font-medium sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Mobile: icon-only trigger */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggle}
        className="md:hidden"
        aria-label="Search"
      >
        <Icons.search />
        <span className="sr-only">Search</span>
      </Button>
    </>
  )
}
