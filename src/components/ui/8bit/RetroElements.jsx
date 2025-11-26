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
	primary: "retro-button bg-gradient-to-b from-teal-400 to-teal-600 text-[#050714]",
	secondary: "retro-button bg-gradient-to-b from-[#262b59] to-[#131735] text-white",
	violet: "retro-button bg-gradient-to-b from-[#a855f7] to-[#6b21a8] text-white",
	blue: "retro-button bg-gradient-to-b from-[#60a5fa] to-[#1d4ed8] text-white",
}

export function RetroButton({ children, variant = "primary", className, as = "button", ...props }) {
	const Comp = as
	return (
		<Comp className={cn(buttonVariants[variant] || buttonVariants.primary, className)} {...props}>
			{children}
		</Comp>
	)
}


