import React, { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import LinkSection from "./components/LinkSection.jsx"

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

	return (
		<section ref={containerRef} className="relative h-[220vh] bg-[#0b0d26]">
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
				<div className="absolute inset-0 flex items-center justify-center z-[90]">
					<div className="bg-black/50 border-4 border-gray-700 rounded-lg px-6 py-4">
						<h1 className="text-white text-3xl text-center leading-relaxed font-pixel tracking-wider">
							ENTER THE
							<br />
							AFTERLIFE
						</h1>
					</div>
				</div>
			</div>
		</section>
	)
}

export default function App() {
	return (
		<div className="min-h-[300vh] bg-[#0f1130]">
			<ParallaxScene />
			<LinkSection />
		</div>
	)
}


