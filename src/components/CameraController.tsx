import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { NavMode } from '../App'
import { cameraPath } from '../data/paintings'

interface CameraControllerProps {
  navMode: NavMode
  setNavMode: (mode: NavMode) => void
  currentStop: number
  setCurrentStop: (stop: number) => void
}

export default function CameraController({
  navMode,
  setNavMode,
  currentStop,
  setCurrentStop,
}: CameraControllerProps) {
  const { camera, gl } = useThree()

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })
  const moveSpeed = 3

  const targetPos = useRef(new THREE.Vector3(0, 1.6, 8))
  const targetLookAt = useRef(new THREE.Vector3(0, 1.8, 0))
  const currentLookAt = useRef(new THREE.Vector3(0, 1.8, 0))

  // Debounce ref for scroll
  const scrollCooldown = useRef(false)

  // Find nearest tour stop to current camera position
  const findNearestStop = useCallback(() => {
    let minDist = Infinity
    let nearestIdx = 0
    cameraPath.points.forEach((point, i) => {
      const dist = camera.position.distanceTo(
        new THREE.Vector3(...point.pos)
      )
      if (dist < minDist) {
        minDist = dist
        nearestIdx = i
      }
    })
    return nearestIdx
  }, [camera])

  // Keyboard handlers
  // WASD → free walk mode
  // Arrow keys / Space → guided tour navigation (snaps from free if needed)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // WASD — movement keys for free walk
      switch (e.code) {
        case 'KeyW': keys.current.forward = true; break
        case 'KeyS': keys.current.backward = true; break
        case 'KeyA': keys.current.left = true; break
        case 'KeyD': keys.current.right = true; break
      }

      // WASD switches to free mode automatically
      if (['KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(e.code) && navMode === 'guided') {
        setNavMode('free')
      }

      // Arrow keys / Space — always navigate guided tour
      if (['ArrowRight', 'ArrowDown', 'Space'].includes(e.code)) {
        e.preventDefault()
        if (navMode === 'free') {
          const nearest = findNearestStop()
          setCurrentStop(Math.min(cameraPath.points.length - 1, nearest + 1))
          setNavMode('guided')
        } else {
          setCurrentStop(Math.min(cameraPath.points.length - 1, currentStop + 1))
        }
      } else if (['ArrowLeft', 'ArrowUp'].includes(e.code)) {
        e.preventDefault()
        if (navMode === 'free') {
          const nearest = findNearestStop()
          setCurrentStop(Math.max(0, nearest - 1))
          setNavMode('guided')
        } else {
          setCurrentStop(Math.max(0, currentStop - 1))
        }
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': keys.current.forward = false; break
        case 'KeyS': keys.current.backward = false; break
        case 'KeyA': keys.current.left = false; break
        case 'KeyD': keys.current.right = false; break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [navMode, currentStop, setCurrentStop, setNavMode, findNearestStop])

  // Scroll handler
  // Guided: navigate between stops
  // Free: snap to nearest stop and return to guided
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (scrollCooldown.current) return

      const threshold = 20
      if (Math.abs(e.deltaY) < threshold) return

      if (navMode === 'free') {
        // Snap to nearest tour stop
        const nearest = findNearestStop()
        setCurrentStop(nearest)
        setNavMode('guided')
        scrollCooldown.current = true
        setTimeout(() => { scrollCooldown.current = false }, 800)
        return
      }

      // Guided mode — navigate stops
      if (e.deltaY > 0) {
        setCurrentStop(Math.min(cameraPath.points.length - 1, currentStop + 1))
      } else {
        setCurrentStop(Math.max(0, currentStop - 1))
      }
      scrollCooldown.current = true
      setTimeout(() => { scrollCooldown.current = false }, 800)
    }

    // Touch support for mobile
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (scrollCooldown.current) return
      const delta = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(delta) < 50) return

      if (navMode === 'free') {
        const nearest = findNearestStop()
        setCurrentStop(nearest)
        setNavMode('guided')
        scrollCooldown.current = true
        setTimeout(() => { scrollCooldown.current = false }, 800)
        return
      }

      if (delta > 0) {
        setCurrentStop(Math.min(cameraPath.points.length - 1, currentStop + 1))
      } else {
        setCurrentStop(Math.max(0, currentStop - 1))
      }
      scrollCooldown.current = true
      setTimeout(() => { scrollCooldown.current = false }, 800)
    }

    const el = gl.domElement
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [navMode, currentStop, setCurrentStop, setNavMode, findNearestStop, gl.domElement])

  // Update target when stop changes
  useEffect(() => {
    const stop = cameraPath.points[currentStop]
    if (stop) {
      targetPos.current.set(...stop.pos)
      targetLookAt.current.set(...stop.lookAt)
    }
  }, [currentStop])

  useFrame((_, delta) => {
    if (navMode === 'guided') {
      // Smooth ease-out interpolation
      const lerpFactor = 1 - Math.pow(0.02, delta)

      camera.position.lerp(targetPos.current, lerpFactor)
      currentLookAt.current.lerp(targetLookAt.current, lerpFactor)
      camera.lookAt(currentLookAt.current)
    } else if (navMode === 'free') {
      // WASD movement relative to camera direction
      const direction = new THREE.Vector3()
      camera.getWorldDirection(direction)
      direction.y = 0
      direction.normalize()
      const right = new THREE.Vector3().crossVectors(camera.up, direction).negate().normalize()

      const velocity = new THREE.Vector3()
      if (keys.current.forward) velocity.addScaledVector(direction, moveSpeed * delta)
      if (keys.current.backward) velocity.addScaledVector(direction, -moveSpeed * delta)
      if (keys.current.left) velocity.addScaledVector(right, -moveSpeed * delta)
      if (keys.current.right) velocity.addScaledVector(right, moveSpeed * delta)

      const newPos = camera.position.clone().add(velocity)
      const margin = 0.5
      newPos.x = THREE.MathUtils.clamp(newPos.x, -11.5 + margin, 11.5 - margin)
      newPos.z = THREE.MathUtils.clamp(newPos.z, -9.5 + margin, 9.5 - margin)
      newPos.y = 1.6

      camera.position.copy(newPos)
    }
  })

  return null
}
