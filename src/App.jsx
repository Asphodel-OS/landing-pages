import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const layers = [
	{ src: "/assets/title screen/Backdrop.png", speed: 0.1, z: 0 },
	{ src: "/assets/title screen/Mountain_range.png", speed: 0.2, z: 10 },
	{ src: "/assets/title screen/River.png", speed: 0.35, z: 20 },
	{ src: "/assets/title screen/Gravestones.png", speed: 0.45, z: 30 },
	{ src: "/assets/title screen/Torii_gate.png", speed: 0.55, z: 40 },
	{ src: "/assets/title screen/Spirit_orb.png", speed: 0.75, z: 50 },
	{ src: "/assets/title screen/Butterflies_3.png", speed: 0.85, z: 60 },
	{ src: "/assets/title screen/Butterflies_2.png", speed: 0.9, z: 70 },
	{ src: "/assets/title screen/Butterflies_1.png", speed: 1.0, z: 80 },
]

function ParallaxScene() {
	const containerRef = useRef(null)
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end start"],
	})

	const steps = [
		{
			heading: "Enter the Afterlife",
			text: "Awaken at the river’s edge as the veil between worlds parts.",
		},
		{
			heading: "Echoes of the Mountain",
			text: "The wind carries names you once knew. Do you remember yours?",
		},
		{
			heading: "Gravestones Whisper",
			text: "Memories take form—markers of choices made and paths untaken.",
		},
		{
			heading: "Gate of Passage",
			text: "Beneath the torii, the path is clear. Step lightly, seeker.",
		},
		{
			heading: "Choose Your Rite",
			text: "The ritual begins when you are ready. The spirits await.",
		},
	]

	return (
		<section ref={containerRef} className="relative h-[600vh] bg-[#0b0d26]">
			<div className="sticky top-0 h-screen w-full overflow-hidden">
				{layers.map((layer) => {
					const y = useTransform(scrollYProgress, [0, 1], [0, -layer.speed * 300])
					return (
						<motion.img
							key={layer.src}
							src={layer.src}
							alt=""
							className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
							style={{
								y,
								zIndex: layer.z,
							}}
							draggable={false}
						/>
					)
				})}
				{steps.map((step, i) => {
					const len = steps.length
					const start = i / len
					const end = (i + 1) / len
					const opacity = useTransform(
						scrollYProgress,
						[start, start + 0.08, end - 0.08, end],
						[0, 1, 1, 0]
					)
					const y = useTransform(scrollYProgress, [start, end], [40, -40])

					return (
						<motion.div
							key={step.heading}
							className="absolute inset-0 z-[90] flex items-center justify-center px-6"
							style={{ opacity }}
						>
							<motion.div
								className="bg-black/55 border-4 border-gray-700 rounded-lg max-w-xl w-full px-6 py-6 text-center"
								style={{ y }}
							>
								<h2 className="text-white text-2xl leading-relaxed font-pixel tracking-wide mb-4">
									{step.heading}
								</h2>
								<p className="text-indigo-100 text-sm leading-7">
									{step.text}
								</p>
								{ i === len - 1 && (
									<div className="mt-8 grid grid-cols-2 gap-4">
										<a href="#start" className="pixel-button bg-gray-800/80 rounded-lg border-2 border-teal-500 hover:bg-gray-700 text-center py-3">
											Start Ritual
										</a>
										<a href="#explore" className="pixel-button bg-gray-800/80 rounded-lg border-2 border-teal-500 hover:bg-gray-700 text-center py-3">
											Explore
										</a>
										<a href="https://www.nexon.com" target="_blank" rel="noreferrer" className="pixel-button bg-gray-800/80 rounded-lg border-2 border-teal-500 hover:bg-gray-700 text-center py-3">
											Nexon
										</a>
										<a href="#about" className="pixel-button bg-gray-800/80 rounded-lg border-2 border-teal-500 hover:bg-gray-700 text-center py-3">
											About Us
										</a>
									</div>
								)}
							</motion.div>
						</motion.div>
					)
				})}
			</div>
		</section>
	)
}

export default function App() {
	return (
		<div className="min-h-[100vh] bg-[#0f1130]">
			<ParallaxScene />
		</div>
	)
}


