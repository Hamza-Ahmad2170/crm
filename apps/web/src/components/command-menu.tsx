import * as React from 'react'
import { useRouter } from '@tanstack/react-router'
import { useHotkey } from '@tanstack/react-hotkeys'

import { navGroups } from '@/config/nav-config'
import { Icons } from '@/components/icons'
import { useTheme } from '@/components/theme-provider'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

type CommandMenuContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  toggle: () => void
}

const CommandMenuContext = React.createContext<CommandMenuContextValue | null>(
  null,
)

/** Open/close the command palette from anywhere inside <CommandMenu>. */
export function useCommandMenu() {
  const context = React.useContext(CommandMenuContext)
  if (!context) {
    throw new Error('useCommandMenu must be used within <CommandMenu>')
  }
  return context
}

type FlatItem = {
  title: string
  url: string
  disabled?: boolean
  shortcut?: [string, string]
  icon?: keyof typeof Icons
}

type Section = { label: string; items: FlatItem[] }

const themes = [
  { name: 'Light', value: 'light' as const },
  { name: 'Dark', value: 'dark' as const },
  { name: 'System', value: 'system' as const },
]

export function CommandMenu({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [open, setOpen] = React.useState(false)
  const toggle = React.useCallback(() => setOpen((prev) => !prev), [])

  // Global ⌘K / Ctrl+K shortcut (works on every screen size).
  useHotkey('Mod+K', toggle)

  const sections = React.useMemo<Section[]>(
    () =>
      navGroups.map((group) => ({
        label: group.label,
        items: group.items.flatMap((item) => [item, ...(item.items ?? [])]),
      })),
    [],
  )

  const navigateTo = React.useCallback(
    (url: string) => {
      setOpen(false)
      router.navigate({ to: url })
    },
    [router],
  )

  const value = React.useMemo<CommandMenuContextValue>(
    () => ({ open, setOpen, toggle }),
    [open, toggle],
  )

  return (
    <CommandMenuContext value={value}>
      {children}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command Palette"
        description="Search for a page or run a command"
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {sections.map((section) => (
            <CommandGroup key={section.label} heading={section.label}>
              {section.items.map((item) => {
                const Icon = item.icon ? Icons[item.icon] : null
                return (
                  <CommandItem
                    key={item.url}
                    value={item.title}
                    disabled={item.disabled}
                    onSelect={() => navigateTo(item.url)}
                  >
                    {Icon ? <Icon /> : null}
                    <span>{item.title}</span>
                    {item.shortcut ? (
                      <CommandShortcut>{item.shortcut.join('')}</CommandShortcut>
                    ) : null}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          ))}

          <CommandSeparator />

          <CommandGroup heading="Theme">
            {themes.map((theme) => (
              <CommandItem
                key={theme.value}
                value={theme.name}
                onSelect={() => {
                  setTheme(theme.value)
                  setOpen(false)
                }}
              >
                <span>{theme.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </CommandMenuContext>
  )
}
