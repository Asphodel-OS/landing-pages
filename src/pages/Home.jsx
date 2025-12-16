import React, { useEffect, useMemo, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { RetroPanel, RetroRibbon, RetroButton } from "@/components/ui/8bit/RetroElements"
import { KamiCreator } from "../components/KamiCreator/KamiCreator"

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
const PRESENTS_HOLD_MULTIPLIER = 3
const MAX_SCENE_WIDTH = 2200

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
	const [zoomScale, setZoomScale] = useState(1)
	const [imageSizes, setImageSizes] = useState({})
	const [rawOverflow, setRawOverflow] = useState(0)
	const [showKamiCreator, setShowKamiCreator] = useState(false)
	const layoutWidth = viewport.w ? Math.min(viewport.w, MAX_SCENE_WIDTH) : 0

	const responsive = useMemo(() => {
		const w = layoutWidth || viewport.w || 1440
		const h = viewport.h || 900
		const base = {
			scrollPages: 3.2,
			introFraction: 0.1,
			layerOffsets: withLayerOffsets(),
			introDisplayMultiplier: 2,
			introDelayFraction: 0.018,
			ctaRevealRatio: 0.75,
			introPaddingTop: 108,
			introPaddingX: 24,
			introCardPadding: "20px 24px",
			introMaxWidth: 420,
			ctaWrapperPaddingX: 24,
			ctaWrapperPaddingY: 32,
			ctaPanelPadding: "32px 36px",
			ctaMaxWidth: 720,
			ctaCols: 2,
			ctaGap: 24,
			logoRatio: 0.18,
			logoMaxWidth: 620,
			logoPaddingX: 24,
		}

		if (w <= 600) {
			return {
				...base,
				scrollPages: 2.3,
				introFraction: 0.15,
				introDelayFraction: 0.005,
				ctaRevealRatio: 0.55,
				introPaddingTop: 80,
				introPaddingX: 16,
				introCardPadding: "16px 18px",
				introMaxWidth: 320,
				ctaWrapperPaddingX: 16,
				ctaWrapperPaddingY: 22,
				ctaPanelPadding: "24px 20px",
				ctaMaxWidth: 380,
				ctaCols: 1,
				ctaGap: 16,
				logoRatio: 0.08,
				logoMaxWidth: 360,
				logoPaddingX: 12,
				layerOffsets: withLayerOffsets({
					"/assets/title-screen/Mountain_range.png": 0.44,
					"/assets/title-screen/River.png": 0.48,
					"/assets/title-screen/Gravestones.png": 0.52,
					"/assets/title-screen/Torii_gate.png": 0.48,
				}),
			}
		}

		if (w <= 900) {
			return {
				...base,
				scrollPages: 2.6,
				introFraction: 0.13,
				introDelayFraction: 0.01,
				ctaRevealRatio: 0.6,
				introPaddingTop: 88,
				introPaddingX: 18,
				introCardPadding: "18px 22px",
				introMaxWidth: 360,
				ctaWrapperPaddingX: 18,
				ctaWrapperPaddingY: 26,
				ctaPanelPadding: "28px 24px",
				ctaMaxWidth: 520,
				ctaCols: 2,
				ctaGap: 20,
				logoRatio: 0.16,
				logoMaxWidth: 520,
				logoPaddingX: 18,
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
				introPaddingTop: 96,
				introPaddingX: 22,
				ctaWrapperPaddingX: 22,
				ctaWrapperPaddingY: 30,
				ctaPanelPadding: "30px 28px",
				ctaMaxWidth: 640,
				layerOffsets: withLayerOffsets({
					"/assets/title-screen/Mountain_range.png": 0.72,
					"/assets/title-screen/River.png": 0.75,
					"/assets/title-screen/Gravestones.png": 0.68,
					"/assets/title-screen/Torii_gate.png": 0.54,
				}),
				logoRatio: 0.17,
				logoMaxWidth: 580,
				logoPaddingX: 20,
			}
		}

		if (w >= 2200) {
			return {
				...base,
				scrollPages: 3.8,
				introFraction: 0.085,
				introDelayFraction: 0.035,
				ctaRevealRatio: 0.78,
				introPaddingTop: 132,
				introPaddingX: 36,
				introCardPadding: "26px 34px",
				ctaWrapperPaddingX: 40,
				ctaWrapperPaddingY: 44,
				ctaPanelPadding: "40px 48px",
				ctaMaxWidth: 920,
				ctaCols: 2,
				ctaGap: 32,
				logoRatio: 0.22,
				logoMaxWidth: 840,
				logoPaddingX: 36,
				layerOffsets: withLayerOffsets({
					"/assets/title-screen/Mountain_range.png": 0.65,
					"/assets/title-screen/River.png": 0.68,
					"/assets/title-screen/Gravestones.png": 0.7,
					"/assets/title-screen/Torii_gate.png": 0.66,
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
				introPaddingTop: 120,
				introPaddingX: 30,
				introCardPadding: "24px 30px",
				ctaWrapperPaddingX: 32,
				ctaWrapperPaddingY: 36,
				ctaPanelPadding: "36px 40px",
				ctaMaxWidth: 860,
				ctaCols: 2,
				ctaGap: 28,
				logoRatio: 0.2,
				logoMaxWidth: 720,
				logoPaddingX: 32,
				layerOffsets: withLayerOffsets({
					"/assets/title-screen/Mountain_range.png": 0.57,
					"/assets/title-screen/River.png": 0.61,
					"/assets/title-screen/Gravestones.png": 0.64,
					"/assets/title-screen/Torii_gate.png": 0.6,
				}),
			}
		}

		return base
	}, [layoutWidth, viewport.h])

	const {
		scrollPages,
		introFraction,
		layerOffsets: responsiveLayerOffsets,
		introDelayFraction,
		introDisplayMultiplier,
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
		logoRatio,
		logoMaxWidth,
		logoPaddingX,
	} = responsive

	useEffect(() => {
		const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
		onResize()
		window.addEventListener("resize", onResize)
		return () => window.removeEventListener("resize", onResize)
	}, [])

	useEffect(() => {
		if (typeof window === "undefined" || !window.visualViewport) return undefined
		const updateZoom = () => setZoomScale(window.visualViewport?.scale || 1)
		updateZoom()
		window.visualViewport.addEventListener("resize", updateZoom)
		window.visualViewport.addEventListener("scroll", updateZoom)
		return () => {
			window.visualViewport?.removeEventListener("resize", updateZoom)
			window.visualViewport?.removeEventListener("scroll", updateZoom)
		}
	}, [])

	// Measure natural size and compute integer pixel scale + travel
	useEffect(() => {
		const img = new Image()
		// Use the same source as the first layer to match whichever backdrop is active
		img.src = layers[0].src
		const compute = () => {
			const widthForScale = layoutWidth || viewport.w
			if (!img.naturalWidth || !img.naturalHeight || !widthForScale || !viewport.h) return
			setBaseSize({ w: img.naturalWidth, h: img.naturalHeight })
			// Integer scaling to preserve pixel art and COVER the viewport both axes
			const coverW = Math.ceil(widthForScale / img.naturalWidth)
			const coverH = Math.ceil(viewport.h / img.naturalHeight)
			const intScale = Math.max(1, Math.max(coverW, coverH))
			setPixelScale(intScale)
			const displayedHeight = img.naturalHeight * intScale
			const travel = Math.max(0, displayedHeight - viewport.h)
			setRawOverflow(travel)
			setBackdropTravel(travel > 0 ? travel : Math.round(viewport.h * 0.25))
		}
		if (img.complete) compute()
		else img.onload = compute
	}, [layoutWidth, viewport.w, viewport.h])

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
	const effectiveViewportHeight = useMemo(() => {
		const base = viewport.h || 600
		const scale = Math.max(1, zoomScale || 1)
		return base * scale
	}, [viewport.h, zoomScale])
	const viewportHeightPx = viewport.h || 0

	const sectionHeight = useMemo(() => {
		return Math.round(effectiveViewportHeight * scrollPages + backdropTravel)
	}, [effectiveViewportHeight, backdropTravel, scrollPages])
	const effectiveWidth = layoutWidth || viewport.w || 0
	const isVeryNarrow = effectiveWidth > 0 && effectiveWidth <= 600

	const overflowBuffer = viewportHeightPx * 0.18 + Math.max(24, viewportHeightPx * 0.02)
	const needsTightSpacing = viewportHeightPx > 0 && rawOverflow <= overflowBuffer
	const spacingScale = needsTightSpacing ? 0.88 : 1
	const layerOffsetScale = needsTightSpacing ? 0.94 : 1
	const sceneScale = needsTightSpacing ? 0.94 : 1
	const introPaddingTopTight = Math.round(introPaddingTop * spacingScale)
	const introPaddingXTight = Math.round(introPaddingX * spacingScale)
	const ctaWrapperPaddingXTight = Math.round(ctaWrapperPaddingX * spacingScale)
	const ctaWrapperPaddingYTight = Math.round(ctaWrapperPaddingY * spacingScale)
	const ctaGapTight = Math.max(8, Math.round(ctaGap * spacingScale))

	const introTimings = useMemo(() => {
		const latestIntroStart = Math.max(0, introFraction - 0.01)
		const introStart = Math.min(introDelayFraction, latestIntroStart)
		const baseSpan = Math.max(0.001, introFraction - introStart)
		const multiplier = Math.max(1, introDisplayMultiplier || 1)
		const effectiveSpan = Math.min(baseSpan * multiplier, 0.55)
		const fadeInEnd = introStart + effectiveSpan * 0.35
		const holdEnd = introStart + effectiveSpan * 0.8
		const introEnd = Math.min(introStart + effectiveSpan, 0.92)
		return { introStart, fadeInEnd, holdEnd, introEnd }
	}, [introFraction, introDelayFraction, introDisplayMultiplier])

	// Each layer starts at the image top (y=0) and moves up to reveal the bottom
	// (y = -backdropTravel). We keep parallax by using different curve exponents.

	// Reserve a small portion of the timeline for the studio intro before step 1
	// (adjusted dynamically for extreme aspect ratios).
	// CTA timings also adapt per-breakpoint so short scrolls still get an early reveal.
	const viewportHeight = viewportHeightPx || 1
	const scrollScreens = scrollPages + backdropTravel / Math.max(1, effectiveViewportHeight)
	const ctaRatioBoost =
		scrollScreens <= 2.4 ? -0.12 : scrollScreens <= 2.9 ? -0.07 : scrollScreens >= 3.6 ? 0.02 : 0
	const normalizedCtaRatio = clamp(ctaRevealRatio + ctaRatioBoost, 0.5, 0.88)
	const ctaFullFraction = introFraction + normalizedCtaRatio * (1 - introFraction)
	const ctaFadeWindow = clamp((1 - normalizedCtaRatio) * 0.55, 0.08, 0.2)
	const minCtaStart = Math.min(introTimings.introEnd + 0.02, 0.96)
	const ctaFadeStart = clamp(ctaFullFraction - ctaFadeWindow, Math.max(introFraction + 0.015, minCtaStart), 0.98)
	const finalStart = Math.min(ctaFullFraction, 0.985)
	const presentsTimings = useMemo(() => {
		const fadeInEnd = introTimings.fadeInEnd
		const holdSpan = Math.max(0.0001, introTimings.holdEnd - fadeInEnd)
		const fadeOutSpan = Math.max(0.0001, introTimings.introEnd - introTimings.holdEnd)
		const safeCtaStart = Number.isFinite(ctaFadeStart) ? ctaFadeStart : 0.97
		const holdCap = Math.max(fadeInEnd + 0.01, Math.min(safeCtaStart - 0.02, 0.94))
		const stretchedHoldEnd = Math.min(
			fadeInEnd + holdSpan * PRESENTS_HOLD_MULTIPLIER,
			holdCap
		)
		const fadeOutCap = Math.max(stretchedHoldEnd + 0.005, Math.min(safeCtaStart - 0.01, 0.965))
		const stretchedIntroEnd = Math.min(stretchedHoldEnd + fadeOutSpan, fadeOutCap)
		return { ...introTimings, holdEnd: stretchedHoldEnd, introEnd: stretchedIntroEnd }
	}, [introTimings, ctaFadeStart])
	const midLogoTimings = useMemo(() => {
		const start = Math.min(introTimings.introEnd + 0.05, 0.5)
		const holdCandidate = Math.min(start + 0.22, ctaFadeStart - 0.05)
		const hold = holdCandidate > start ? holdCandidate : start + 0.06
		const endCandidate = Math.min(hold + 0.12, finalStart - 0.02)
		const end = endCandidate > hold ? endCandidate : hold + 0.02
		return { start, hold, end }
	}, [introTimings.introEnd, ctaFadeStart, finalStart])
	const midLogoBaseY = useMemo(() => Math.min((viewport.h || 780) * logoRatio, 240), [viewport.h, logoRatio])
	const midLogoY = useMemo(
		() => {
			if (isVeryNarrow) return 20
			return needsTightSpacing ? midLogoBaseY * 0.9 : midLogoBaseY
		},
		[midLogoBaseY, needsTightSpacing, isVeryNarrow]
	)
	const finalLogoBaseY = useMemo(() => {
		const vh = viewport.h || 780
		const dynamicLift = Math.min(vh * 0.74, 660)
		return -Math.max(dynamicLift, 300)
	}, [viewport.h])
	const finalLogoY = useMemo(
		() => (needsTightSpacing ? finalLogoBaseY * 0.92 : finalLogoBaseY),
		[finalLogoBaseY, needsTightSpacing]
	)

	return (
		<section
			ref={containerRef}
			className="relative bg-[#0b0d26]"
			style={{
				height: `${sectionHeight}px`,
				position: "relative",
				maxWidth: `${MAX_SCENE_WIDTH}px`,
				width: "100%",
				margin: "0 auto",
		}}
		>
			<div className="sticky top-0 h-screen w-full overflow-hidden">
				<div
					className="relative h-full w-full"
					style={{
						transform: `scale(${sceneScale})`,
						transformOrigin: "center",
						}}
				>
					{layers.map((layer) => {
						// Non-linear per-layer progress to restore strong parallax while
						// keeping all layers aligned at the end frame.
						const curved = useTransform(scrollYProgress, (v) =>
							Math.pow(Math.min(1, Math.max(0, v)), layer.power)
						)
						const baseOffset = (responsiveLayerOffsets[layer.src] ?? layer.offsetVH ?? 0) * (viewport.h || 0)
						const startOffset = baseOffset * layerOffsetScale
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
					const opacity = useTransform(
						scrollYProgress,
						[0, presentsTimings.introStart, presentsTimings.fadeInEnd, presentsTimings.holdEnd, presentsTimings.introEnd],
						[0, 0, 1, 1, 0]
					)
					const y = useTransform(scrollYProgress, [presentsTimings.introStart, presentsTimings.introEnd], [20, -10])
					return (
						<motion.div
							className="absolute inset-0 z-[95] flex items-start justify-center"
							style={{
								opacity,
								paddingTop: introPaddingTopTight,
								paddingLeft: introPaddingXTight,
								paddingRight: introPaddingXTight,
								pointerEvents: "none",
							}}
						>
							<motion.div style={{ y, maxWidth: introMaxWidth, width: "100%" }}>
								<RetroPanel className="flex flex-col items-center gap-5" style={{ padding: introCardPadding }}>
									<img
										src="/assets/title-screen/asphodel.png"
										alt="Asphdel Studios"
										className="h-14 object-contain mx-auto drop-shadow-[0_4px_0_rgba(6,9,24,0.8)]"
										draggable={false}
									/>
									<RetroRibbon>
										<span>Presents</span>
									</RetroRibbon>
								</RetroPanel>
							</motion.div>
						</motion.div>
					)
				})()}
				{/* Mid logo hero */}
				{(() => {
					const opacity = useTransform(
						scrollYProgress,
						[midLogoTimings.start, midLogoTimings.hold],
						[0, 1]
					)
					const y = useTransform(
						scrollYProgress,
						[midLogoTimings.start, midLogoTimings.hold, ctaFadeStart, 1],
						[-80, midLogoY, midLogoY, finalLogoY]
					)
					return (
						<motion.div
							className={`absolute inset-0 z-[92] flex ${isVeryNarrow ? "items-start" : "items-center"} justify-center pointer-events-none`}
							style={{ opacity }}
						>
							<motion.div style={{ y, width: "100%", maxWidth: logoMaxWidth, padding: `0 ${logoPaddingX}px` }}>
								<div className="flex flex-col items-center">
									<img
										src="/assets/title-screen/kami-logo.png"
										alt="Kamigotchi"
										className="w-full px-6 drop-shadow-[0_6px_0_rgba(5,7,20,0.85)]"
										style={{ maxWidth: 840 }}
										draggable={false}
									/>
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
								paddingLeft: ctaWrapperPaddingXTight,
								paddingRight: ctaWrapperPaddingXTight,
								paddingTop: ctaWrapperPaddingYTight,
								paddingBottom: ctaWrapperPaddingYTight,
							}}
						>
							<motion.div style={{ y, maxWidth: ctaMaxWidth, width: "100%" }}>
								<RetroPanel className="flex flex-col items-center" style={{ padding: ctaPanelPadding }}>
									<h2 className="text-white text-3xl leading-relaxed font-pixel tracking-wide mt-6 mb-4 drop-shadow-[0_4px_0_rgba(6,9,24,0.8)]">
										Let's Begin.
									</h2>
									<p className="text-indigo-100 text-sm leading-7 max-w-md">
										Make a selection.
									</p>
									<div
										className="mt-8 grid w-full"
										style={{
											gap: `${ctaGapTight}px`,
											gridTemplateColumns: `repeat(${ctaCols}, minmax(0, 1fr))`,
										}}
									>
										<RetroButton as="a" href="https://app.kamigotchi.io/" className="text-center text-[#facc15] drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
											Enter World
										</RetroButton>
										<RetroButton onClick={() => setShowKamiCreator(true)} variant="secondary" className="text-center text-white">
											Meme Generator
										</RetroButton>
										<RetroButton
											as="a"
											href="https://sudoswap.xyz/#/browse/yominet/buy/0x5d4376b62fa8ac16dfabe6a9861e11c33a48c677"
											target="_blank"
											rel="noreferrer"
											variant="violet"
											className="text-center text-white"
										>
											Buy a Kami
										</RetroButton>
										<RetroButton as="a" href="/leaderboard" variant="blue" className="text-center text-white">
											Stats
										</RetroButton>
									</div>
								</RetroPanel>
							</motion.div>
						</motion.div>
					)
				})()}
				</div>
			</div>
		{showKamiCreator && (
			<div className="fixed inset-0 z-[9999]">
				<KamiCreator onClose={() => setShowKamiCreator(false)} />
			</div>
		)}
		</section>
	)
}

export default function Home() {
	return (
		<div className="min-h-[100vh] bg-[#0f1130]">
			<ParallaxScene />
		</div>
	)
}


