import { GATE_ORDER } from '../../lib/gate/canTrade'
import { gateLabelEls } from './sceneState'

/** Fixed DOM layer for the gate names; positions are written by the scene every frame. */
export function GateLabels() {
  return (
    <div className="gate-labels" aria-hidden="true">
      {GATE_ORDER.map((g, i) => (
        <div
          key={g.id}
          className="gate-label"
          ref={(el) => {
            gateLabelEls[i] = el
          }}
          style={{ visibility: 'hidden' }}
        >
          <span>{String(i + 1).padStart(2, '0')}</span> {g.label}
        </div>
      ))}
    </div>
  )
}
