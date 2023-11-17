import { FC } from 'react'
import { Row } from './types'
import { Pool } from 'utils/usePools'
import { formatPercent } from '@sushiswap/format'
export const PoolMyPositionAprCell: FC<Row<{ totalApr1d: number; incentives: Pool }>> = ({ row }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {formatPercent(row.totalApr1d)}
        </div>
      </div>
    </div>
  )
}
