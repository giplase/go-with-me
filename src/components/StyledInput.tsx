"use client"
import InfoIcon from "@/shared/icons/InfoIcon"
import { Tooltip } from "@base-ui/react"
import TooltipPortal from "./TooltipPortal"
import { ComponentPropsWithoutRef } from "react"
const tooltipHandle = Tooltip.createHandle<React.ReactNode>()

interface StyledInputProps extends ComponentPropsWithoutRef<"input"> {
  label: string
  error: boolean
  errorPayload: string
}

export default function StyledInput({ label, type, error, errorPayload, ...props }: StyledInputProps) {
  return (
    <Tooltip.Provider>
      <label className="relative flex flex-col gap-0.5">
        {label}
        {error && (
          <Tooltip.Trigger
            className="absolute top-0 right-0 flex items-center justify-center border-0 bg-transparent select-none"
            payload={errorPayload}
            handle={tooltipHandle}
            delay={200}
          >
            <InfoIcon />
          </Tooltip.Trigger>
        )}
        <input
          type={type}
          className={`bg-foreground focus:outline-border border-border w-full rounded-md border-2 p-2 focus:outline-2 ${type === "date" ? "uppercase" : ""} scheme-dark ${error ? "border-warning" : ""}`}
          autoComplete="off"
          {...props}
        />
      </label>
      <Tooltip.Root handle={tooltipHandle}>{({ payload }) => <TooltipPortal payload={payload} />}</Tooltip.Root>
    </Tooltip.Provider>
  )
}
