import React from "react"
import { cn } from "@/lib/utils"

const variantClasses = {
	default: "bg-white text-[#050714] hover:bg-slate-100",
	secondary: "bg-slate-800 text-white hover:bg-slate-700",
	outline: "border border-white/40 text-white hover:bg-white/10",
	ghost: "text-white hover:bg-white/10",
	link: "text-teal-300 underline-offset-4 hover:underline",
}

const sizeClasses = {
	default: "h-10 px-4 py-2",
	sm: "h-9 px-3",
	lg: "h-11 px-8",
	icon: "h-10 w-10",
}

const Button = React.forwardRef(
	({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
		const Comp = asChild ? "span" : "button"
		return (
			<Comp
				ref={ref}
				className={cn(
					"inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 disabled:pointer-events-none disabled:opacity-50",
					variantClasses[variant],
					sizeClasses[size],
					className
				)}
				{...props}
			/>
		)
	}
)
Button.displayName = "Button"

export { Button }


