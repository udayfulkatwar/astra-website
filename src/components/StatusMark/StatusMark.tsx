import type { ProductStatus } from '../../lib/productFacts'
import styles from './StatusMark.module.css'

const TONE: Record<ProductStatus, string> = {
  Implemented: 'pass',
  Simulated: 'lilac',
  Planned: 'ember',
}

export function StatusMark({ status }: { status: ProductStatus }) {
  return (
    <span className={styles.mark} data-tone={TONE[status]}>
      {status}
    </span>
  )
}
