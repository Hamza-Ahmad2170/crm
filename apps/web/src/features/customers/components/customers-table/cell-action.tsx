import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'

import { Icons } from '#/components/icons.tsx'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  deleteCustomerMutationOptions,
  type Customer,
} from '@/features/customers/api'

export function CellAction({ data }: { data: Customer }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const queryClient = useQueryClient()
  const deleteMutation = useMutation(deleteCustomerMutationOptions(queryClient))

  const handleDelete = () => {
    deleteMutation.mutate(data.id, {
      onSettled: () => setConfirmOpen(false),
    })
  }

  return (
    <div className="text-left">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Open actions">
              <EllipsisVertical />
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          {/* TODO: wire to the edit sheet when it exists */}
          <DropdownMenuItem onClick={() => console.log('edit', data.id)}>
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setConfirmOpen(true)}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Icons.trash />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes{' '}
              <span className="font-medium text-foreground">{data.name}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
            >
              {deleteMutation.isPending ? (
                <Icons.spinner className="animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
