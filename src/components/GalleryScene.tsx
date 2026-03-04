import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import type { NavMode } from '../App'
import GalleryRoom from './GalleryRoom'
import Paintings from './Paintings'
import GalleryPeople from './GalleryPeople'
import CameraController from './CameraController'
import GalleryLighting from './GalleryLighting'

interface GallerySceneProps {
  navMode: NavMode
  setNavMode: (mode: NavMode) => void
  onLoaded: () => void
  currentStop: number
  setCurrentStop: (stop: number) => void
}

export default function GalleryScene({
  navMode,
  setNavMode,
  onLoaded,
  currentStop,
  setCurrentStop,
}: GallerySceneProps) {
  const { gl } = useThree()

  useEffect(() => {
    const timeout = setTimeout(onLoaded, 1500)
    return () => clearTimeout(timeout)
  }, [onLoaded])

  useEffect(() => {
    gl.toneMapping = 4 // ACESFilmicToneMapping
    gl.toneMappingExposure = 1.1
  }, [gl])

  return (
    <>
      <Environment preset="apartment" background={false} environmentIntensity={0.4} />

      <GalleryLighting />
      <GalleryRoom />
      <Paintings />
      <GalleryPeople />

      <CameraController
        navMode={navMode}
        setNavMode={setNavMode}
        currentStop={currentStop}
        setCurrentStop={setCurrentStop}
      />
    </>
  )
}
