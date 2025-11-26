import React from "react"
import { motion } from "framer-motion"
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

const motionTagMap = {
	button: motion.button,
	a: motion.a,
}

export const RetroButton = React.forwardRef(function RetroButton(props, ref) {
	const { children, variant = "primary", className, as = "button", ...rest } = props
	const MotionComponent = typeof as === "string" ? motionTagMap[as] || motion.button : motion.button

	return (
		<MotionComponent
			ref={ref}
			className={cn(buttonVariants[variant] || buttonVariants.primary, className)}
			whileHover={{ y: -5, scale: 1.015 }}
			whileTap={{ y: 2, scale: 0.97 }}
			transition={{ type: "spring", stiffness: 420, damping: 26, mass: 0.6 }}
			{...rest}
		>
			{children}
		</MotionComponent>
	)
})


