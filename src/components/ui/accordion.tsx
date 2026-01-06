"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Plus, Minus } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("bg-[#F3F3F3] rounded-md px-4 mb-3", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-[18px] cursor-pointer max-[600px]:text-[14px] font-semibold transition-all outline-none",
          className
        )}
        {...props}
      >
        {children}
        <AccordionIcon />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionIcon() {
  return (
    <div className="text-muted-foreground border h-[20px] w-[20px] flex justify-center items-center border-[#020C13] group-data-[state=open]:border-pink-600 rounded-full pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200">
      <Plus className="size-4 text-black group-data-[state=open]:hidden" />
      <Minus className="size-4 text-pink-600 hidden group-data-[state=open]:block" />
    </div>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-[14px] max-[600px]:text-[12px]"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
