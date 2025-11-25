import React, { useEffect, useMemo, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const layers = [
	// Parallax via curve exponents:
	// Larger power -> slower early movement (background), smaller power (<1) -> faster early movement (foreground).
	{ src: "/assets/title-screen/Backdrop_dark.png", power: 20, z: 0 },
	{ src: "/assets/title-screen/Mountain_range.png", power: 8, z: 10, offsetVH: 0.545 },
	{ src: "/assets/title-screen/River.png", power: 10, z: 20, offsetVH: 0.55 },
	{ src: "/assets/title-screen/Gravestones.png", power: 11, z: 30, offsetVH: 0.6 },
	{ src: "/assets/title-screen/Torii_gate.png", power: 12, z: 40, offsetVH: 0.55 },
	{ src: "/assets/title-screen/Spirit_orb.png", power: 8, z: 1 },
	{ src: "/assets/title-screen/Butterflies_3.png", power: 0.75, z: 60 },
	{ src: "/assets/title-screen/Butterflies_2.png", power: 0.8, z: 70 },
	{ src: "/assets/title-screen/Butterflies_1.png", power: 0.6, z: 80 },
]

const defaultLayerOffsets = layers.reduce((acc, layer) => {
	acc[layer.src] = layer.offsetVH ?? -0.14
	return acc
}, {})

const withLayerOffsets = (overrides = {}) => ({
	...defaultLayerOffsets,
	...overrides,
})

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

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

	const responsive = useMemo(() => {
		const w = viewport.w || 1440
		const h = viewport.h || 900
		const base = {
			scrollPages: 3.2,
			introFraction: 0.1,
			layerOffsets: withLayerOffsets(),
			introDelayFraction: 0.018,
			ctaRevealRatio: 0.75,
			introPaddingTop: 48,
			introPaddingX: 24,
			introCardPadding: "20px 24px",
			introMaxWidth: 420,
			ctaWrapperPaddingX: 24,
			ctaWrapperPaddingY: 32,
			ctaPanelPadding: "24px 28px",
			ctaMaxWidth: 640,
			ctaCols: 2,
			ctaGap: 16,
		}

		if (w <= 480 || h <= 640) {
			return {
				...base,
				scrollPages: 2.3,
				introFraction: 0.15,
				introDelayFraction: 0.005,
				ctaRevealRatio: 0.55,
				introPaddingTop: 20,
				introPaddingX: 16,
				introCardPadding: "16px 18px",
				introMaxWidth: 320,
				ctaWrapperPaddingX: 16,
				ctaWrapperPaddingY: 22,
				ctaPanelPadding: "20px 18px",
				ctaMaxWidth: 340,
				ctaCols: 1,
				ctaGap: 12,
				layerOffsets: withLayerOffsets({
					"/assets/title-screen/Mountain_range.png": 0.44,
					"/assets/title-screen/River.png": 0.48,
					"/assets/title-screen/Gravestones.png": 0.52,
					"/assets/title-screen/Torii_gate.png": 0.48,
				}),
			}
		}

		if (w <= 768 || h <= 820) {
			return {
				...base,
				scrollPages: 2.6,
				introFraction: 0.13,
				introDelayFraction: 0.01,
				ctaRevealRatio: 0.6,
				introPaddingTop: 28,
				introPaddingX: 18,
				introCardPadding: "18px 22px",
				introMaxWidth: 360,
				ctaWrapperPaddingX: 18,
				ctaWrapperPaddingY: 26,
				ctaPanelPadding: "22px 22px",
				ctaMaxWidth: 440,
				ctaCols: 1,
				ctaGap: 14,
				layerOffsets: withLayerOffsets({
					"/assets/title-screen/Mountain_range.png": 0.48,
					"/assets/title-screen/River.png": 0.52,
					"/assets/title-screen/Gravestones.png": 0.56,
					"/assets/title-screen/Torii_gate.png": 0.52,
				}),
			}
		}

		if (w <= 1200 || h <= 940) {
			return {
				...base,
				scrollPages: 3,
				introDelayFraction: 0.015,
				ctaRevealRatio: 0.68,
				introPaddingTop: 36,
				introPaddingX: 22,
				ctaWrapperPaddingX: 22,
				ctaWrapperPaddingY: 30,
				ctaPanelPadding: "24px 26px",
				ctaMaxWidth: 560,
				layerOffsets: withLayerOffsets({
					"/assets/title-screen/Mountain_range.png": 0.52,
					"/assets/title-screen/River.png": 0.55,
					"/assets/title-screen/Gravestones.png": 0.58,
					"/assets/title-screen/Torii_gate.png": 0.54,
				}),
			}
		}

		if (w >= 1800) {
			return {
				...base,
				scrollPages: 3.5,
				introFraction: 0.09,
				introDelayFraction: 0.03,
				ctaRevealRatio: 0.76,
				introPaddingTop: 60,
				introPaddingX: 30,
				introCardPadding: "24px 30px",
				ctaWrapperPaddingX: 32,
				ctaWrapperPaddingY: 36,
				ctaPanelPadding: "28px 32px",
				ctaMaxWidth: 780,
				ctaCols: 3,
				ctaGap: 18,
				layerOffsets: withLayerOffsets({
					"/assets/title-screen/Mountain_range.png": 0.57,
					"/assets/title-screen/River.png": 0.61,
					"/assets/title-screen/Gravestones.png": 0.64,
					"/assets/title-screen/Torii_gate.png": 0.6,
				}),
			}
		}

		return base
	}, [viewport.w, viewport.h])

	const {
		scrollPages,
		introFraction,
		layerOffsets: responsiveLayerOffsets,
		introDelayFraction,
		introPaddingTop,
		introPaddingX,
		introCardPadding,
		introMaxWidth,
		ctaRevealRatio,
		ctaWrapperPaddingX,
		ctaWrapperPaddingY,
		ctaPanelPadding,
		ctaMaxWidth,
		ctaCols,
		ctaGap,
	} = responsive

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
		return Math.round((viewport.h || 600) * scrollPages + backdropTravel)
	}, [viewport.h, backdropTravel, scrollPages])

	// Each layer starts at the image top (y=0) and moves up to reveal the bottom
	// (y = -backdropTravel). We keep parallax by using different curve exponents.

	// Reserve a small portion of the timeline for the studio intro before step 1
	// (adjusted dynamically for extreme aspect ratios).
	// CTA timings also adapt per-breakpoint so short scrolls still get an early reveal.
	const viewportHeight = viewport.h || 1
	const scrollScreens = scrollPages + backdropTravel / Math.max(1, viewportHeight)
	const ctaRatioBoost =
		scrollScreens <= 2.4 ? -0.12 : scrollScreens <= 2.9 ? -0.07 : scrollScreens >= 3.6 ? 0.02 : 0
	const normalizedCtaRatio = clamp(ctaRevealRatio + ctaRatioBoost, 0.5, 0.88)
	const ctaFullFraction = introFraction + normalizedCtaRatio * (1 - introFraction)
	const ctaFadeWindow = clamp((1 - normalizedCtaRatio) * 0.55, 0.08, 0.2)
	const ctaFadeStart = clamp(ctaFullFraction - ctaFadeWindow, introFraction + 0.015, 0.98)
	const finalStart = Math.min(ctaFullFraction, 0.985)

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
					const startOffset = (responsiveLayerOffsets[layer.src] ?? layer.offsetVH ?? 0) * (viewport.h || 0)
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
					const latestIntroStart = Math.max(0, introFraction - 0.01)
					const introStart = Math.min(introDelayFraction, latestIntroStart)
					const introSpan = Math.max(0.001, introFraction - introStart)
					const fadeInEnd = introStart + introSpan * 0.4
					const holdEnd = introStart + introSpan * 0.85
					const opacity = useTransform(
						scrollYProgress,
						[0, introStart, fadeInEnd, holdEnd, introFraction],
						[0, 0, 1, 1, 0]
					)
					const y = useTransform(scrollYProgress, [introStart, introFraction], [20, -10])
					return (
						<motion.div
							className="absolute inset-0 z-[95] flex items-start justify-center"
							style={{
								opacity,
								paddingTop: introPaddingTop,
								paddingLeft: introPaddingX,
								paddingRight: introPaddingX,
							}}
						>
							<motion.div
								className="relative rounded-2xl border-4 border-gray-700 w-full text-center overflow-hidden shadow-[0_0_40px_rgba(11,21,56,0.65)]"
								style={{ y, maxWidth: introMaxWidth, padding: introCardPadding }}
							>
								<div className="absolute inset-0 bg-gradient-to-b from-[#141b46]/90 via-[#0c102d]/95 to-[#050714] pointer-events-none" />
								<div className="absolute inset-0 rounded-[18px] border border-white/5 pointer-events-none" />
								<div className="relative z-10 flex flex-col items-center">
									<img
										src="/assets/title-screen/asphodel.png"
										alt="Asphdel Studios"
										className="h-14 object-contain mx-auto mt-5 mb-4 drop-shadow-[0_4px_0_rgba(6,9,24,0.8)]"
										draggable={false}
									/>
									<div className="inline-flex items-center gap-2 rounded-full border border-teal-400/50 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-teal-200">
										<span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_6px_rgba(94,234,212,0.9)]" />
										<span>Presents</span>
									</div>
								</div>
							</motion.div>
						</motion.div>
					)
				})()}
				{/* Final CTA only, 100% opacity (shows in last segment) */}
				{(() => {
					const opacity = useTransform(scrollYProgress, [ctaFadeStart, finalStart], [0, 1])
					const y = useTransform(scrollYProgress, [ctaFadeStart, 1], [40, -10])
					return (
						<motion.div
							className="absolute inset-0 z-[90] flex items-center justify-center"
							style={{
								opacity,
								paddingLeft: ctaWrapperPaddingX,
								paddingRight: ctaWrapperPaddingX,
								paddingTop: ctaWrapperPaddingY,
								paddingBottom: ctaWrapperPaddingY,
							}}
						>
							<motion.div
								className="relative rounded-2xl border-4 border-gray-700 w-full text-center overflow-hidden shadow-[0_0_40px_rgba(11,21,56,0.65)]"
								style={{ y, maxWidth: ctaMaxWidth, padding: ctaPanelPadding }}
							>
								<div className="absolute inset-0 bg-gradient-to-b from-[#141b46]/90 via-[#0c102d]/95 to-[#050714] pointer-events-none" />
								<div className="absolute inset-0 rounded-[18px] border border-white/5 pointer-events-none" />
								<div className="relative z-10 flex flex-col items-center">
									<div className="inline-flex items-center gap-2 rounded-full border border-teal-400/50 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-teal-200">
										<span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_6px_rgba(94,234,212,0.9)]" />
										<span>Welcome</span>
									</div>
									<h2 className="text-white text-3xl leading-relaxed font-pixel tracking-wide mt-6 mb-4 drop-shadow-[0_4px_0_rgba(6,9,24,0.8)]">
										Let's Begin.
									</h2>
									<p className="text-indigo-100 text-sm leading-7 max-w-md">
										Make a selection.
									</p>
									<div
										className="mt-8 grid w-full"
										style={{
											gap: `${ctaGap}px`,
											gridTemplateColumns: `repeat(${ctaCols}, minmax(0, 1fr))`,
										}}
									>
										<a
											href="#start"
											className="pixel-button bg-gradient-to-b from-teal-500 to-teal-700 rounded-lg border-2 border-teal-300/80 hover:brightness-110 text-center py-3 text-[#050714]"
										>
											Start New Game
										</a>
										<a
											href="#explore"
											className="pixel-button bg-gray-900/90 rounded-lg border-2 border-teal-500/70 hover:bg-gray-800 text-center py-3"
										>
											Meme Generator
										</a>
										<a
											href="https://sudoswap.xyz/"
											target="_blank"
											rel="noreferrer"
											className="pixel-button bg-gray-900/90 rounded-lg border-2 border-violet-500/80 hover:bg-gray-800 text-center py-3"
										>
											SudoSwap
										</a>
										<a
											href="#about"
											className="pixel-button bg-gray-900/90 rounded-lg border-2 border-blue-500/80 hover:bg-gray-800 text-center py-3"
										>
											Stats
										</a>
									</div>
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


