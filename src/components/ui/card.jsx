import React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("rounded-lg border border-white/10 bg-black/50 text-white shadow-lg", className)}
		{...props}
	/>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("flex flex-col gap-2 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
	<h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
	<p ref={ref} className={cn("text-sm text-white/70", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

const CardAction = React.forwardRef(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("flex flex-wrap items-center gap-3", className)} {...props} />
))
CardAction.displayName = "CardAction"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction }


