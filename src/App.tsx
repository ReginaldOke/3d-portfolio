import { Suspense, useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import GalleryScene from './components/GalleryScene'
import LoadingScreen from './components/LoadingScreen'
import NavigationUI from './components/NavigationUI'
import type { PaintingSlide } from './data/paintings'

// Navigation is now unified:
// - Scroll / chevrons → guided tour (moves between stops)
// - WASD / arrow keys → free walk mode
// - If user scrolls while in free walk → snap to nearest tour stop

export type NavMode = 'guided' | 'free'

interface ZoomDetail {
  slides: PaintingSlide[]
  currentSlide: number
}

export default function App() {
  const [navMode, setNavMode] = useState<NavMode>('guided')
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentStop, setCurrentStop] = useState(0)
  const [zoomed, setZoomed] = useState<ZoomDetail | null>(null)

  const handleLoaded = useCallback(() => setIsLoaded(true), [])

  // Listen for zoom events from Painting component
  useEffect(() => {
    const handler = (e: Event) => {
      setZoomed((e as CustomEvent).detail)
    }
    window.addEventListener('zoomPainting', handler)
    return () => window.removeEventListener('zoomPainting', handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    if (!zoomed) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomed(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [zoomed])

  const zoomedSlide = zoomed ? zoomed.slides[zoomed.currentSlide] : null

  return (
    <div className="w-full h-full relative">
      {!isLoaded && <LoadingScreen />}

      <Canvas
        shadows
        camera={{ fov: 60, near: 0.1, far: 100, position: [0, 1.65, 8] }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          pixelRatio: Math.min(window.devicePixelRatio, 2),
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <GalleryScene
            navMode={navMode}
            setNavMode={setNavMode}
            onLoaded={handleLoaded}
            currentStop={currentStop}
            setCurrentStop={setCurrentStop}
          />
        </Suspense>
      </Canvas>

      {isLoaded && (
        <NavigationUI
          navMode={navMode}
          currentStop={currentStop}
          setCurrentStop={setCurrentStop}
        />
      )}

      {/* Fullscreen zoom overlay for painting details */}
      {zoomed && zoomedSlide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          onClick={() => setZoomed(null)}
        >
          <div
            className="relative max-w-2xl w-full mx-6 bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setZoomed(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Video preview */}
            {zoomedSlide.type === 'video' && (
              <div className="w-full aspect-video bg-gray-100">
                <video
                  src={zoomedSlide.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 sm:p-8">
              <h2
                className="text-xl sm:text-2xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
                {zoomedSlide.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {zoomedSlide.description}
              </p>

              {/* Slide indicator */}
              {zoomed.slides.length > 1 && (
                <div className="flex items-center gap-2 mt-5">
                  {zoomed.slides.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setZoomed({ ...zoomed, currentSlide: i })}
                      className={`h-1.5 rounded-full transition-all ${
                        i === zoomed.currentSlide
                          ? 'bg-gray-900 w-6'
                          : 'bg-gray-300 w-2 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
