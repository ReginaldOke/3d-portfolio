import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { PaintingData } from '../data/paintings'

/**
 * Video texture that creates and manages its own <video> element
 * for reliable, glitch-free playback.
 */
function VideoSurface({ src, width, height }: { src: string; width: number; height: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const textureRef = useRef<THREE.VideoTexture | null>(null)

  useEffect(() => {
    const video = document.createElement('video')
    video.src = src
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.setAttribute('playsinline', '')

    const texture = new THREE.VideoTexture(video)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    texture.format = THREE.RGBAFormat

    videoRef.current = video
    textureRef.current = texture

    // Start playback
    const playVideo = () => {
      video.play().catch(() => {
        // Retry on user interaction
        const handleClick = () => {
          video.play()
          document.removeEventListener('click', handleClick)
        }
        document.addEventListener('click', handleClick)
      })
    }

    video.addEventListener('canplaythrough', playVideo, { once: true })
    video.load()

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial
      mat.map = texture
      mat.needsUpdate = true
    }

    return () => {
      video.pause()
      video.removeAttribute('src')
      video.load()
      texture.dispose()
    }
  }, [src])

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial toneMapped={false} side={THREE.FrontSide} />
    </mesh>
  )
}

// Liquid glass chevron style
const liquidGlassChevron: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(50, 50, 50, 0.7)',
  fontSize: '22px',
  fontWeight: 300,
  boxShadow:
    '0 8px 32px rgba(31, 38, 135, 0.12), inset 0 2px 12px rgba(255, 255, 255, 0.2)',
  transition: 'all 0.2s',
  padding: 0,
  lineHeight: 1,
}

interface PaintingProps {
  data: PaintingData
}

export default function Painting({ data }: PaintingProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visible, setVisible] = useState(true)
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  const slide = data.slides[currentSlide]
  const hasMultipleSlides = data.slides.length > 1

  // Check if camera is facing the front of the painting (dot product check)
  useFrame(() => {
    if (!groupRef.current) return
    const paintingWorldPos = new THREE.Vector3()
    groupRef.current.getWorldPosition(paintingWorldPos)

    // Get the painting's forward direction (local +Z in world space)
    const forward = new THREE.Vector3(0, 0, 1)
    forward.applyQuaternion(groupRef.current.getWorldQuaternion(new THREE.Quaternion()))

    // Vector from painting to camera
    const toCamera = new THREE.Vector3().subVectors(camera.position, paintingWorldPos)
    toCamera.normalize()

    // If dot product > 0, camera is in front of the painting
    const dot = forward.dot(toCamera)
    setVisible(dot > -0.1)
  })

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCurrentSlide((prev) => (prev - 1 + data.slides.length) % data.slides.length)
    },
    [data.slides.length]
  )

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCurrentSlide((prev) => (prev + 1) % data.slides.length)
    },
    [data.slides.length]
  )

  const [canvasW, canvasH] = data.scale
  const stretcherDepth = 0.12 // How far canvas protrudes from wall

  // Gallery label card — small plaque below painting like a real museum
  const labelW = 0.42
  const labelH = 0.22
  const labelDepth = 0.006
  const labelGap = 0.06 // Gap between bottom of canvas and top of label

  return (
    <group ref={groupRef} position={data.position} rotation={data.rotation}>

      {/* ── 3D CANVAS ── white rectangle behind design, protruding like a real canvas */}
      <group position={[0, 0, stretcherDepth / 2]}>

        {/* Canvas box — white backing that sticks out from wall */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[canvasW, canvasH, stretcherDepth]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.88}
            metalness={0.0}
          />
        </mesh>

        {/* Video surface — front face only, slightly in front of canvas box */}
        <group position={[0, 0, stretcherDepth / 2 + 0.001]}>
          <VideoSurface src={slide.src} width={canvasW} height={canvasH} />
        </group>

        {/* Thin white border around the video (like canvas edge wrap) */}
        {/* Top edge */}
        <mesh position={[0, canvasH / 2, stretcherDepth / 2 + 0.0005]}>
          <planeGeometry args={[canvasW, 0.015]} />
          <meshStandardMaterial color="#f5f2ed" roughness={0.9} />
        </mesh>
        {/* Bottom edge */}
        <mesh position={[0, -canvasH / 2, stretcherDepth / 2 + 0.0005]}>
          <planeGeometry args={[canvasW, 0.015]} />
          <meshStandardMaterial color="#f5f2ed" roughness={0.9} />
        </mesh>
        {/* Left edge */}
        <mesh position={[-canvasW / 2, 0, stretcherDepth / 2 + 0.0005]}>
          <planeGeometry args={[0.015, canvasH]} />
          <meshStandardMaterial color="#f5f2ed" roughness={0.9} />
        </mesh>
        {/* Right edge */}
        <mesh position={[canvasW / 2, 0, stretcherDepth / 2 + 0.0005]}>
          <planeGeometry args={[0.015, canvasH]} />
          <meshStandardMaterial color="#f5f2ed" roughness={0.9} />
        </mesh>
      </group>

      {/* ── GALLERY LABEL ── small white plaque on wall below painting */}
      {visible && (
      <group
        position={[0, -canvasH / 2 - labelGap - labelH / 2, labelDepth / 2 + 0.001]}
      >
        {/* Physical card */}
        <mesh castShadow>
          <boxGeometry args={[labelW, labelH, labelDepth]} />
          <meshStandardMaterial color="#f8f8f6" roughness={0.92} metalness={0.0} />
        </mesh>

        {/* Label text — flat on card surface */}
        <Html
          position={[0, 0, labelDepth / 2 + 0.001]}
          center
          transform
          distanceFactor={1.2}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div style={{
            width: '120px',
            padding: '6px 8px',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}>
            <p style={{
              fontSize: '7px',
              fontWeight: 700,
              color: '#1a1a1a',
              margin: '0 0 2px 0',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
            }}>
              {slide.title}
            </p>
            <p style={{
              fontSize: '4.5px',
              color: '#444',
              margin: '0',
              lineHeight: 1.5,
              fontWeight: 400,
            }}>
              {slide.description}
            </p>

            {/* Slide indicator dots */}
            {hasMultipleSlides && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                marginTop: '3px',
              }}>
                {data.slides.map((_, i) => (
                  <div key={i} style={{
                    width: i === currentSlide ? '8px' : '3px',
                    height: '3px',
                    borderRadius: '2px',
                    background: i === currentSlide ? '#333' : '#ccc',
                    transition: 'all 0.3s ease',
                  }} />
                ))}
              </div>
            )}
          </div>
        </Html>
      </group>
      )}

      {/* ── CAROUSEL CHEVRONS ── liquid glass style, floating beside painting */}
      {hasMultipleSlides && (
        <group visible={visible}>
          {/* Left chevron */}
          <Html
            position={[-canvasW / 2 - 0.4, 0, stretcherDepth + 0.02]}
            center
            distanceFactor={5}
            style={{ pointerEvents: 'auto', userSelect: 'none' }}
          >
            <button
              onClick={handlePrev}
              style={liquidGlassChevron}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.55)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Html>

          {/* Right chevron */}
          <Html
            position={[canvasW / 2 + 0.4, 0, stretcherDepth + 0.02]}
            center
            distanceFactor={5}
            style={{ pointerEvents: 'auto', userSelect: 'none' }}
          >
            <button
              onClick={handleNext}
              style={liquidGlassChevron}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.55)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Html>
        </group>
      )}
    </group>
  )
}
