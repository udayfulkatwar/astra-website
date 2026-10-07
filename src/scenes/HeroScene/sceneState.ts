import * as THREE from 'three'
import { PALETTE } from '../../lib/three'

export const GATE_COUNT = 9

/** Uniform objects shared by reference across every material; written once per frame by <SceneController />. */
export const shared = {
  uTime: { value: 0 },
  uPixelRatio: { value: 1 },
  uSignals: { value: 0 },
  uGates: { value: 0 },
  uLock: { value: 0 },
  uCoreC: { value: new THREE.Vector3(1.6, 0, 0) },
  uCoreScale: { value: 1 },
  uTunnelStart: { value: new THREE.Vector3(-2, -0.3, 0) },
  uTunnelDir: { value: new THREE.Vector3(1, 0, 0) },
  uGap: { value: 0.6 },
  uTunnelR: { value: 0.62 },
  uVis: { value: new THREE.Vector2(8, 4.7) },
  uPointer: { value: new THREE.Vector2() },
  uBone: { value: new THREE.Color(PALETTE.bone) },
  uEmber: { value: new THREE.Color(PALETTE.ember) },
  uLilac: { value: new THREE.Color(PALETTE.lilac) },
  uPass: { value: new THREE.Color(PALETTE.pass) },
}

/** Per-frame derived values (not uniforms) read by components. */
export const frame = {
  p: 0,
  signals: 0,
  gates: 0,
  lock: 0,
  outro: 0,
  pointerX: 0,
  pointerY: 0,
  layout: {
    portrait: false,
    visW: 8,
    visH: 4.7,
    core: new THREE.Vector3(1.6, 0, 0),
    coreScale: 1,
    tunnelCenter: new THREE.Vector3(0.8, -0.3, 0),
    tunnelLen: 5,
  },
}

export const CAMERA_DISTANCE = 8
export const CAMERA_FOV = 35

/** DOM gate labels, registered by <GateLabels /> and positioned by <AgentCore /> each frame. */
export const gateLabelEls: (HTMLElement | null)[] = []
