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
  const rotateSpeed = 2

  const targetPos = useRef(new THREE.Vector3(0, 1.6, 8))
  const targetLookAt = useRef(new THREE.Vector3(0, 1.8, 0))
  const currentLookAt = useRef(new THREE.Vector3(0, 1.8, 0))

  // Free-look state
  const yaw = useRef(0)   // horizontal angle (radians)
  const pitch = useRef(0)  // vertical angle (radians)
  const freeInited = useRef(false)

  // Mouse drag state
  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })

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
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': keys.current.forward = true; break
        case 'KeyS': keys.current.backward = true; break
        case 'KeyA': keys.current.left = true; break
        case 'KeyD': keys.current.right = true; break
      }

      // WASD switches to free mode
      if (['KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(e.code) && navMode === 'guided') {
        setNavMode('free')
      }

      // Arrow keys / Space — guided tour navigation
      if (['ArrowRight', 'ArrowDown', 'Space'].includes(e.code)) {
        e.preventDefault()
        if (navMode === 'free') {
          const nearest = findNearestStop()
          setCurrentStop(Math.min(cameraPath.points.length - 1, nearest + 1))
          setNavMode('guided')
          freeInited.current = false
        } else {
          setCurrentStop(Math.min(cameraPath.points.length - 1, currentStop + 1))
        }
      } else if (['ArrowLeft', 'ArrowUp'].includes(e.code)) {
        e.preventDefault()
        if (navMode === 'free') {
          const nearest = findNearestStop()
          setCurrentStop(Math.max(0, nearest - 1))
          setNavMode('guided')
          freeInited.current = false
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

  // Mouse drag handler for free-look
  useEffect(() => {
    const el = gl.domElement

    const onPointerDown = (e: PointerEvent) => {
      // Only enter free look on left-click drag
      if (e.button !== 0) return
      isDragging.current = true
      lastMouse.current = { x: e.clientX, y: e.clientY }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return

      // Switch to free mode on drag
      if (navMode === 'guided') {
        setNavMode('free')
      }

      const dx = e.clientX - lastMouse.current.x
      const dy = e.clientY - lastMouse.current.y
      lastMouse.current = { x: e.clientX, y: e.clientY }

      const sensitivity = 0.003
      yaw.current -= dx * sensitivity
      pitch.current -= dy * sensitivity
      pitch.current = THREE.MathUtils.clamp(pitch.current, -Math.PI / 3, Math.PI / 3)
    }

    const onPointerUp = () => {
      isDragging.current = false
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [navMode, setNavMode, gl.domElement])

  // Scroll handler
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (scrollCooldown.current) return

      const threshold = 20
      if (Math.abs(e.deltaY) < threshold) return

      if (navMode === 'free') {
        const nearest = findNearestStop()
        setCurrentStop(nearest)
        setNavMode('guided')
        freeInited.current = false
        scrollCooldown.current = true
        setTimeout(() => { scrollCooldown.current = false }, 1800)
        return
      }

      if (e.deltaY > 0) {
        setCurrentStop(Math.min(cameraPath.points.length - 1, currentStop + 1))
      } else {
        setCurrentStop(Math.max(0, currentStop - 1))
      }
      scrollCooldown.current = true
      setTimeout(() => { scrollCooldown.current = false }, 1800)
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
        freeInited.current = false
        scrollCooldown.current = true
        setTimeout(() => { scrollCooldown.current = false }, 1800)
        return
      }

      if (delta > 0) {
        setCurrentStop(Math.min(cameraPath.points.length - 1, currentStop + 1))
      } else {
        setCurrentStop(Math.max(0, currentStop - 1))
      }
      scrollCooldown.current = true
      setTimeout(() => { scrollCooldown.current = false }, 1800)
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

  // Reset free-look init when returning to guided mode
  useEffect(() => {
    if (navMode === 'guided') {
      freeInited.current = false
    }
  }, [navMode])

  useFrame((_, delta) => {
    if (navMode === 'guided') {
      // Slow, buttery smooth interpolation — like walking slowly through a gallery
      const lerpFactor = 1 - Math.pow(0.12, delta)

      camera.position.lerp(targetPos.current, lerpFactor)
      currentLookAt.current.lerp(targetLookAt.current, lerpFactor)
      camera.lookAt(currentLookAt.current)
    } else if (navMode === 'free') {
      // Initialize yaw/pitch from current camera direction on first free frame
      if (!freeInited.current) {
        const dir = new THREE.Vector3()
        camera.getWorldDirection(dir)
        yaw.current = Math.atan2(-dir.x, -dir.z)
        pitch.current = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1))
        freeInited.current = true
      }

      // A/D rotate the camera
      if (keys.current.left) yaw.current += rotateSpeed * delta
      if (keys.current.right) yaw.current -= rotateSpeed * delta

      // Forward direction from yaw (horizontal only for movement)
      const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current))
      const right = new THREE.Vector3(-Math.cos(yaw.current), 0, Math.sin(yaw.current))

      // W/S move in the direction the camera faces
      const velocity = new THREE.Vector3()
      if (keys.current.forward) velocity.addScaledVector(forward, moveSpeed * delta)
      if (keys.current.backward) velocity.addScaledVector(forward, -moveSpeed * delta)

      const newPos = camera.position.clone().add(velocity)
      const margin = 0.5
      newPos.x = THREE.MathUtils.clamp(newPos.x, -4.78 + margin, 4.78 - margin)
      newPos.z = THREE.MathUtils.clamp(newPos.z, -8 + margin, 8 - margin)
      newPos.y = 1.6

      camera.position.copy(newPos)

      // Look direction from yaw + pitch
      const lookDir = new THREE.Vector3(
        -Math.sin(yaw.current) * Math.cos(pitch.current),
        Math.sin(pitch.current),
        -Math.cos(yaw.current) * Math.cos(pitch.current)
      )
      const lookTarget = camera.position.clone().add(lookDir)
      camera.lookAt(lookTarget)
    }
  })

  return null
}
