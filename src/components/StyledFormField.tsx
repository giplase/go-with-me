"use client"

import { Field } from "@base-ui/react"

interface StyledFormFieldProps extends Field.Control.Props {
  name: string
  label: string
}

export default function StyledFormField({ name, label, ...props }: StyledFormFieldProps) {
  return (
    <Field.Root name={name} className="flex w-xs flex-col gap-1.25">
      <Field.Label className="text-text-main">{label}</Field.Label>
      <Field.Control
        className="text-text-main border-border placeholder:text-text-sub focus:outline-border h-10 w-full rounded-md border p-2.5 focus:outline-2"
        {...props}
      />
      <Field.Error className="text-warning overflow-hidden text-ellipsis" />
    </Field.Root>
  )
}
