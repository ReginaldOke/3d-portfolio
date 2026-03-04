import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import type { NavMode } from '../App'
import GalleryRoom from './GalleryRoom'
import Paintings from './Paintings'
import WineBar from './WineBar'
import CityWindow from './CityWindow'
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
    const timeout = setTimeout(onLoaded, 1000)
    return () => clearTimeout(timeout)
  }, [onLoaded])

  useEffect(() => {
    gl.toneMapping = 4 // ACESFilmicToneMapping
    gl.toneMappingExposure = 1.1
  }, [gl])

  return (
    <>
      <fog attach="fog" args={['#f0ede8', 30, 55]} />

      <Environment preset="apartment" background={false} environmentIntensity={0.35} />

      <GalleryLighting />
      <GalleryRoom />
      <Paintings />
      <WineBar />
      <CityWindow />
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
