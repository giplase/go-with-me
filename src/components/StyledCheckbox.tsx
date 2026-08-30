"use client"
import { Checkbox } from "@base-ui/react"
import CheckIcon from "@/shared/icons/CheckIcon"

interface StyledCheckboxProps extends Checkbox.Root.Props {
  name: string
  label: string
}

export default function StyledCheckbox({ label, ...props }: StyledCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 pb-2.5 text-sm font-normal">
      <Checkbox.Root
        className="border-border bg-foreground data-checked:bg-border focus:outline-border flex size-4 shrink-0 items-center justify-center rounded-sm border-2 p-2 focus:outline-2"
        {...props}
      >
        <Checkbox.Indicator className="flex data-unchecked:hidden">
          <CheckIcon className="text-text-main" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      {label}
    </label>
  )
}
