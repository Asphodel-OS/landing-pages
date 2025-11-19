import React, { useEffect, useMemo, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const layers = [
	// Parallax via curve exponents:
	// Larger power -> slower early movement (background), smaller power (<1) -> faster early movement (foreground).
	{ src: "/assets/title-screen/Backdrop_dark.png", power: 20, z: 0 },
	{ src: "/assets/title-screen/Mountain_range.png", power: 10, z: 10, offsetVH: 0.545 },
	{ src: "/assets/title-screen/River.png", power: 13, z: 20, offsetVH: 0.55 },
	{ src: "/assets/title-screen/Gravestones.png", power: 14, z: 30, offsetVH: 0.6 },
	{ src: "/assets/title-screen/Torii_gate.png", power: 13.5, z: 40, offsetVH: 0.55 },
	{ src: "/assets/title-screen/Spirit_orb.png", power: 10, z: 1 },
	{ src: "/assets/title-screen/Butterflies_3.png", power: 0.75, z: 60 },
	{ src: "/assets/title-screen/Butterflies_2.png", power: 0.8, z: 70 },
	{ src: "/assets/title-screen/Butterflies_1.png", power: 0.6, z: 80 },
]

function ParallaxScene() {
	const containerRef = useRef(null)
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end start"],
	})

	// Viewport and pixel-snap scaling
	const [viewport, setViewport] = useState({ w: 0, h: 0 })
	const [backdropTravel, setBackdropTravel] = useState(300) // fallback travel
	const [baseSize, setBaseSize] = useState({ w: 0, h: 0 })
	const [pixelScale, setPixelScale] = useState(1)
	const [imageSizes, setImageSizes] = useState({})

	useEffect(() => {
		const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
		onResize()
		window.addEventListener("resize", onResize)
		return () => window.removeEventListener("resize", onResize)
	}, [])

	// Measure natural size and compute integer pixel scale + travel
	useEffect(() => {
		const img = new Image()
		// Use the same source as the first layer to match whichever backdrop is active
		img.src = layers[0].src
		const compute = () => {
			if (!img.naturalWidth || !img.naturalHeight || !viewport.w || !viewport.h) return
			setBaseSize({ w: img.naturalWidth, h: img.naturalHeight })
			// Integer scaling to preserve pixel art and COVER the viewport both axes
			const coverW = Math.ceil(viewport.w / img.naturalWidth)
			const coverH = Math.ceil(viewport.h / img.naturalHeight)
			const intScale = Math.max(1, Math.max(coverW, coverH))
			setPixelScale(intScale)
			const displayedHeight = img.naturalHeight * intScale
			const travel = Math.max(0, displayedHeight - viewport.h)
			setBackdropTravel(travel > 0 ? travel : Math.round(viewport.h * 0.25))
		}
		if (img.complete) compute()
		else img.onload = compute
	}, [viewport.w, viewport.h])

	// Preload sizes for each layer to avoid stretching any layer disproportionately
	useEffect(() => {
		const sizes = {}
		let remaining = layers.length
		layers.forEach((layer) => {
			const img = new Image()
			img.src = layer.src
			const done = () => {
				sizes[layer.src] = { w: img.naturalWidth || baseSize.w, h: img.naturalHeight || baseSize.h }
				remaining -= 1
				if (remaining === 0) setImageSizes(sizes)
			}
			if (img.complete) done()
			else img.onload = done
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [layers.map(l => l.src).join(","), baseSize.w, baseSize.h])
	const sectionHeight = useMemo(() => {
		// 5 steps + room to reveal the full image height
		return Math.round((viewport.h || 600) * 5 + backdropTravel)
	}, [viewport.h, backdropTravel])

	// Each layer starts at the image top (y=0) and moves up to reveal the bottom
	// (y = -backdropTravel). We keep parallax by using different curve exponents.

	// Reserve a small portion of the timeline for the studio intro before step 1
	const introFraction = 0.12
	// Compute when the final CTA should appear (last fifth of the scroll after intro)
	const finalStart = introFraction + (4 / 5) * (1 - introFraction)

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
					const natural = imageSizes[layer.src] || baseSize
					const displayedW = natural.w * pixelScale
					const displayedH = natural.h * pixelScale
					return (
						<div
							key={layer.src}
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
							style={{ zIndex: layer.z, width: displayedW, height: displayedH }}
						>
							<motion.img
								src={layer.src}
								alt=""
								className="pixel-image block w-full h-full"
								style={{ y }}
								draggable={false}
							/>
						</div>
					)
				})}
				{/* Intro overlay: Asphodel Studios presents */}
				{(() => {
					const fadeInEnd = introFraction * 0.45
					const holdEnd = introFraction * 0.85
					const opacity = useTransform(
						scrollYProgress,
						[0, fadeInEnd, holdEnd, introFraction],
						[0, 1, 1, 0]
					)
					const y = useTransform(scrollYProgress, [0, introFraction], [20, -10])
					return (
						<motion.div
							className="absolute inset-0 z-[95] flex items-start justify-center pt-10 px-6"
							style={{ opacity }}
						>
							<motion.div
								className="bg-black/55 border-4 border-gray-700 rounded-lg max-w-md w-full px-6 py-5 text-center"
								style={{ y }}
							>
								<img
									src="/assets/title-screen/asphodel.png"
									alt="Asphdel Studios"
									className="h-14 object-contain mx-auto mb-3"
									draggable={false}
								/>
								<p className="text-indigo-100 text-sm leading-7 font-pixel tracking-wide">
									PRESENTS
								</p>
							</motion.div>
						</motion.div>
					)
				})()}
				{/* Final CTA only, 100% opacity (shows in last segment) */}
				{(() => {
					const opacity = useTransform(scrollYProgress, (v) => (v >= finalStart ? 1 : 0))
					const y = useTransform(scrollYProgress, [finalStart, 1], [30, -10])
					return (
						<motion.div
							className="absolute inset-0 z-[90] flex items-center justify-center px-6"
							style={{ opacity }}
						>
							<motion.div
								className="bg-black border-4 border-gray-700 rounded-lg max-w-xl w-full px-6 py-6 text-center"
								style={{ y }}
							>
								<h2 className="text-white text-2xl leading-relaxed font-pixel tracking-wide mb-4">
									Let's Begin.
								</h2>
								<p className="text-indigo-100 text-sm leading-7">
									Your next chapter begins here.
								</p>
								<div className="mt-8 grid grid-cols-2 gap-4">
									<a href="#start" className="pixel-button bg-gray-800 rounded-lg border-2 border-teal-500 hover:bg-gray-700 text-center py-3">
										Begin
									</a>
									<a href="#explore" className="pixel-button bg-gray-800 rounded-lg border-2 border-teal-500 hover:bg-gray-700 text-center py-3">
										Explore
									</a>
									<a href="https://sudoswap.xyz/" target="_blank" rel="noreferrer" className="pixel-button bg-gray-800 rounded-lg border-2 border-teal-500 hover:bg-gray-700 text-center py-3">
										SudoSwap
									</a>
									<a href="#about" className="pixel-button bg-gray-800 rounded-lg border-2 border-teal-500 hover:bg-gray-700 text-center py-3">
										About Us
									</a>
								</div>
							</motion.div>
						</motion.div>
					)
				})()}
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


