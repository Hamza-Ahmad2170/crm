import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import type { Customer } from '../api'
import { Input } from '#/components/ui/input'

interface CustomerFormSheetProps {
  customer?: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomersFormSheet({
  customer,
  onOpenChange,
  open,
}: CustomerFormSheetProps) {
  const isEdit = !!customer

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{isEdit ? 'Edit Customer' : 'New Customer'}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Update the customer details below.'
              : 'Fill in the details to create a new customer.'}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <form action="" className="space-y-4 p-4 md:p-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" name="name" />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input id="phone" name="phone" />
              </Field>
            </FieldGroup>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
