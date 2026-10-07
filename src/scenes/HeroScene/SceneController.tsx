import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { damp, heroPhases, lerp } from '../../lib/animations'
import { store } from '../../lib/store'
import { CAMERA_DISTANCE, CAMERA_FOV, frame, shared } from './sceneState'

/**
 * The conductor: scroll + pointer → phases, responsive layout, camera.
 * Mounts first, so it runs before every other frame callback.
 */
export function SceneController() {
  const { camera, size, gl } = useThree()
  const v = useMemo(
    () => ({
      camCore: new THREE.Vector3(),
      camGate: new THREE.Vector3(),
      camLock: new THREE.Vector3(),
      look: new THREE.Vector3(),
      lookGate: new THREE.Vector3(),
      lookLock: new THREE.Vector3(),
      outroC: new THREE.Vector3(),
    }),
    [],
  )

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20)
    const reduced = store.reducedMotion
    if (!reduced) shared.uTime.value += dt
    shared.uPixelRatio.value = gl.getPixelRatio()

    frame.p = reduced ? store.progress : damp(frame.p, store.progress, 7, dt)
    const outroTarget = store.contactVisible ? Math.max(store.outro, 0.0001) : 0
    frame.outro = reduced ? outroTarget : damp(frame.outro, outroTarget, 5, dt)
    const ph = heroPhases(frame.p)
    // in the outro the cage stays locked
    frame.signals = ph.signals
    frame.gates = store.contactVisible ? 0 : ph.gates
    frame.lock = store.contactVisible ? 1 : ph.lock
    shared.uSignals.value = frame.signals
    shared.uGates.value = frame.gates * (1 - frame.lock)
    shared.uLock.value = frame.lock

    const usePointer = !reduced && size.width >= 768
    frame.pointerX = damp(frame.pointerX, usePointer ? store.pointer.x : 0, 3, dt)
    frame.pointerY = damp(frame.pointerY, usePointer ? store.pointer.y : 0, 3, dt)
    shared.uPointer.value.set(frame.pointerX, frame.pointerY)

    // ---- layout in world units
    const aspect = size.width / size.height
    const visH = 2 * CAMERA_DISTANCE * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2))
    const visW = visH * aspect
    const L = frame.layout
    L.visW = visW
    L.visH = visH
    L.portrait = aspect < 0.9
    shared.uVis.value.set(visW, visH)

    if (L.portrait) {
      L.core.set(0, -visH * 0.2, 0)
      L.coreScale = Math.min(0.78, visW / 3.6)
      L.tunnelCenter.set(0, -visH * 0.24, 0)
      L.tunnelLen = visW * 1.05
    } else {
      const tablet = size.width < 1100
      L.core.set(visW * (tablet ? 0.2 : 0.21), -0.05, 0)
      L.coreScale = tablet ? 0.86 : 1
      L.tunnelCenter.set(visW * 0.24, -0.3, 0)
      L.tunnelLen = Math.min(visW * 0.46, 5.2)
    }

    // contact outro: the locked cage frames the call to action
    if (L.portrait) v.outroC.set(visW * 0.1, visH * 0.24, -0.6)
    else v.outroC.set(visW * 0.24, 0.1, 0)
    shared.uCoreC.value.copy(L.core).lerp(v.outroC, frame.outro)
    shared.uCoreScale.value = lerp(L.coreScale, L.coreScale * (L.portrait ? 0.85 : 1.05), frame.outro)

    const gap = L.tunnelLen / 8
    shared.uGap.value = gap
    shared.uTunnelR.value = L.portrait ? 0.34 : Math.min(0.62, gap * 0.95)
    shared.uTunnelStart.value.copy(L.tunnelCenter).addScaledVector(shared.uTunnelDir.value, -L.tunnelLen / 2)

    // ---- camera choreography
    const C = shared.uCoreC.value
    const G = frame.gates * (1 - frame.lock)
    const Lk = frame.lock
    v.camCore.set(frame.pointerX * 0.35, 0.25 + frame.pointerY * 0.2, CAMERA_DISTANCE)
    // signals: drift slightly left to watch the inflow arrive
    v.camCore.x -= ph.signals * 0.4
    v.camCore.z += ph.signals * 0.5
    // gates: three-quarter view down the tunnel
    v.lookGate.copy(L.tunnelCenter)
    v.camGate.set(
      L.tunnelCenter.x - (L.portrait ? 2.6 : 3.4) + frame.pointerX * 0.25,
      L.tunnelCenter.y + 1.5 + frame.pointerY * 0.15,
      L.tunnelCenter.z + (L.portrait ? 7.4 : 6.6),
    )
    // decision: a little above, looking into the cage
    v.camLock.set(frame.pointerX * 0.3, 0.9 + frame.pointerY * 0.2, CAMERA_DISTANCE - 0.4)

    camera.position.copy(v.camCore).lerp(v.camGate, G).lerp(v.camLock, Lk)
    v.lookLock.set(C.x * 0.12, 0, 0)
    v.look.set(0, 0, 0).lerp(v.lookGate, G).lerp(v.lookLock, Lk)
    camera.lookAt(v.look)
  })

  return null
}
