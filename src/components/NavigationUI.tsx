import { useState, useEffect } from 'react'
import type { NavMode } from '../App'
import { cameraPath } from '../data/paintings'

interface NavigationUIProps {
  navMode: NavMode
  currentStop: number
  setCurrentStop: (stop: number) => void
}

// Liquid glass CSS classes
const glass = `
  bg-white/[0.12]
  backdrop-blur-xl
  border border-white/[0.35]
  shadow-[0_8px_32px_rgba(31,38,135,0.12),inset_0_2px_12px_rgba(255,255,255,0.15)]
`

const glassButton = `
  bg-white/[0.08]
  backdrop-blur-sm
  border border-white/[0.25]
  hover:bg-white/[0.18]
  hover:border-white/[0.4]
  transition-all duration-200
  shadow-[0_2px_8px_rgba(0,0,0,0.06)]
`

export default function NavigationUI({
  navMode,
  currentStop,
  setCurrentStop,
}: NavigationUIProps) {
  const totalStops = cameraPath.points.length
  const [showHint, setShowHint] = useState(true)

  // Auto-hide the initial hint after 5 seconds or on first navigation
  useEffect(() => {
    if (currentStop > 0 || navMode === 'free') {
      setShowHint(false)
    }
  }, [currentStop, navMode])

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 6000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Title — liquid glass pill */}
      <div className={`fixed top-3 left-3 sm:top-5 sm:left-5 z-30 px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl ${glass}`}>
        <h1
          className="text-white/90 text-sm sm:text-base tracking-[0.15em] uppercase leading-none"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Gallery
        </h1>
        <p className="text-white/40 text-[8px] sm:text-[9px] tracking-[0.2em] uppercase mt-0.5 sm:mt-1">
          Product Design Portfolio
        </p>
      </div>

      {/* Bottom navigation bar — liquid glass */}
      <div className={`fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full ${glass}`}>
        {/* Back arrow */}
        <button
          onClick={() => setCurrentStop(Math.max(0, currentStop - 1))}
          disabled={currentStop === 0}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white/60 disabled:opacity-20 disabled:cursor-not-allowed ${glassButton}`}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="sm:w-3.5 sm:h-3.5">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Progress dots */}
        <div className="flex gap-1 sm:gap-1.5 px-0.5 sm:px-1">
          {Array.from({ length: totalStops }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStop(i)}
              className={`h-1.5 rounded-full transition-all duration-400 ${
                i === currentStop
                  ? 'bg-white/90 w-4 sm:w-5'
                  : i < currentStop
                  ? 'bg-white/35 w-1.5'
                  : 'bg-white/15 w-1.5'
              }`}
            />
          ))}
        </div>

        {/* Forward arrow */}
        <button
          onClick={() => setCurrentStop(Math.min(totalStops - 1, currentStop + 1))}
          disabled={currentStop === totalStops - 1}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white/60 disabled:opacity-20 disabled:cursor-not-allowed ${glassButton}`}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="sm:w-3.5 sm:h-3.5">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Free mode indicator */}
      {navMode === 'free' && (
        <div className={`fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full ${glass}`}>
          <p className="text-white/50 text-[10px] sm:text-[11px] tracking-wider whitespace-nowrap">
            Free exploring · <span className="text-white/70">scroll</span> to return to tour
          </p>
        </div>
      )}

      {/* Initial hint — scroll + WASD (desktop only for WASD) */}
      {navMode === 'guided' && showHint && (
        <div
          className={`fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-opacity duration-1000 ${glass}`}
        >
          <p className="text-white/45 text-[10px] sm:text-[11px] tracking-wider whitespace-nowrap">
            <span className="text-white/65">Scroll</span> to explore
            <span className="hidden sm:inline text-white/20 mx-2">|</span>
            <span className="hidden sm:inline text-white/65">WASD</span>
            <span className="hidden sm:inline"> to walk freely</span>
          </p>
        </div>
      )}
    </>
  )
}
