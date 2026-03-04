import { useState, useEffect } from 'react'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 15, 95)
        return next
      })
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1918] transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <h1
        className="text-white/90 text-3xl mb-1 tracking-[0.2em] uppercase"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Gallery
      </h1>
      <p className="text-white/30 text-[10px] tracking-[0.25em] uppercase mb-10">
        Product Design Portfolio
      </p>

      <div className="w-40 h-[1px] bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/60 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-white/20 text-[9px] tracking-wider uppercase mt-4">
        Loading experience
      </p>
    </div>
  )
}
