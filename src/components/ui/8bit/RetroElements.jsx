import React from "react"
import { cn } from "@/lib/utils"
import "./styles/retro.css"

export function RetroPanel({ children, className, ...props }) {
	return (
		<div className={cn("retro retro-panel rounded-2xl text-center text-indigo-100", className)} {...props}>
			{children}
		</div>
	)
}

export function RetroRibbon({ children, className, dotClassName, ...props }) {
	return (
		<div className={cn("retro retro-ribbon", className)} {...props}>
			<span className={cn("retro-ribbon-dot", dotClassName)} />
			{children}
		</div>
	)
}

const buttonVariants = {
	primary: "retro-button retro-button-primary",
	secondary: "retro-button retro-button-secondary",
	violet: "retro-button retro-button-violet",
	blue: "retro-button retro-button-blue",
}

export function RetroButton({ children, variant = "primary", className, as = "button", ...props }) {
	const Comp = as
	return (
		<Comp className={cn(buttonVariants[variant] || buttonVariants.primary, className)} {...props}>
			{children}
		</Comp>
	)
}


