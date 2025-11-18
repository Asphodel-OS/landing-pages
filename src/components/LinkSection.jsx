import React from "react"

export default function LinkSection() {
	const buttons = [
		{ label: "Start Ritual", href: "#start" },
		{ label: "Explore", href: "#explore" },
		{ label: "Nexon", href: "https://www.nexon.com", external: true },
		{ label: "About Us", href: "#about" },
	]

	return (
		<section className="relative z-10 w-full bg-indigo-900 py-24">
			<div className="container mx-auto px-6">
				<div className="mx-auto max-w-xl bg-gray-800/80 rounded-lg border-4 border-gray-700 mb-8">
					<h2 className="text-white text-2xl text-center leading-relaxed font-pixel py-6">
						ENTER THE
						<br />
						AFTERLIFE
					</h2>
				</div>
				<div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
					{buttons.map((btn) => (
						<a
							key={btn.label}
							href={btn.href}
							target={btn.external ? "_blank" : undefined}
							rel={btn.external ? "noreferrer" : undefined}
							className="pixel-button bg-gray-800/80 rounded-lg border-2 border-teal-500 hover:bg-gray-700 text-center py-3"
						>
							{btn.label}
						</a>
					))}
				</div>
			</div>
		</section>
	)
}


