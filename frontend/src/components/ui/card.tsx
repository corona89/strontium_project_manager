import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm"
)

const cardHeaderVariants = cva("flex flex-col space-y-1.5 p-6")
const cardTitleVariants = cva("text-lg font-semibold leading-none tracking-tight")
const cardDescriptionVariants = cva("text-sm text-muted-foreground")
const cardContentVariants = cva("p-6 pt-0")
const cardFooterVariants = cva("flex items-center p-6 pt-0")

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants(), className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardHeaderVariants>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardHeaderVariants(), className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardTitleVariants>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardTitleVariants(), className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardDescriptionVariants>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardDescriptionVariants(), className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardContentVariants>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardContentVariants(), className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardFooterVariants>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardFooterVariants(), className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
