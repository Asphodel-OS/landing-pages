import React, { useEffect, useMemo, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const layers = [
	// Parallax via curve exponents:
	// Larger power -> slower early movement (background), smaller power (<1) -> faster early movement (foreground).
	{ src: "/assets/title screen/Backdrop_dark.png", power: 20, z: 0 },
	{ src: "/assets/title screen/Mountain_range.png", power: 15, z: 10, offsetVH: 0.545 },
	{ src: "/assets/title screen/River.png", power: 15, z: 20, offsetVH: 0.55 },
	{ src: "/assets/title screen/Gravestones.png", power: 14, z: 30, offsetVH: 0.6 },
	{ src: "/assets/title screen/Torii_gate.png", power: 12, z: 40, offsetVH: 0.55 },
	{ src: "/assets/title screen/Spirit_orb.png", power: 10, z: 1 },
	{ src: "/assets/title screen/Butterflies_3.png", power: 0.75, z: 60 },
	{ src: "/assets/title screen/Butterflies_2.png", power: 0.8, z: 70 },
	{ src: "/assets/title screen/Butterflies_1.png", power: 0.6, z: 80 },
]

function ParallaxScene() {
	const containerRef = useRef(null)
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end start"],
	})

	// Viewport tracking
	const [viewport, setViewport] = useState({ w: 0, h: 0 })
	const [backdropTravel, setBackdropTravel] = useState(300) // fallback travel

	useEffect(() => {
		const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
		onResize()
		window.addEventListener("resize", onResize)
		return () => window.removeEventListener("resize", onResize)
	}, [])

	// Measure how much vertical content the backdrop can reveal when using object-cover
	useEffect(() => {
		const img = new Image()
		img.src = "/assets/title screen/Backdrop.png"
		const compute = () => {
			if (!img.naturalWidth || !img.naturalHeight || !viewport.w || !viewport.h) return
			const scale = Math.max(viewport.w / img.naturalWidth, viewport.h / img.naturalHeight)
			const displayedHeight = img.naturalHeight * scale
			const travel = Math.max(0, displayedHeight - viewport.h)
			setBackdropTravel(travel > 0 ? travel : Math.round(viewport.h * 0.25))
		}
		if (img.complete) compute()
		else img.onload = compute
	}, [viewport.w, viewport.h])

	const sectionHeight = useMemo(() => {
		// 5 steps + room to reveal the full image height
		return Math.round((viewport.h || 600) * 5 + backdropTravel)
	}, [viewport.h, backdropTravel])

	// Each layer starts at the image top (y=0) and moves up to reveal the bottom
	// (y = -backdropTravel). We keep parallax by using different curve exponents.

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
		<section
			ref={containerRef}
			className="relative bg-[#0b0d26]"
			style={{ height: `${sectionHeight}px` }}
		>
			<div className="sticky top-0 h-screen w-full overflow-hidden">
				{layers.map((layer) => {
					// Non-linear per-layer progress to restore strong parallax while
					// keeping all layers aligned at the end frame.
					const curved = useTransform(scrollYProgress, (v) =>
						Math.pow(Math.min(1, Math.max(0, v)), layer.power)
					)
					const startOffset = (layer.offsetVH || 0) * (viewport.h || 0)
					const y = useTransform(curved, [0, 1], [startOffset, -backdropTravel])
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
											Begin
										</a>
										<a href="#explore" className="pixel-button bg-gray-800/80 rounded-lg border-2 border-teal-500 hover:bg-gray-700 text-center py-3">
											Explore
										</a>
										<a href="https://sudoswap.xyz/" target="_blank" rel="noreferrer" className="pixel-button bg-gray-800/80 rounded-lg border-2 border-teal-500 hover:bg-gray-700 text-center py-3">
											SudoSwap
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


