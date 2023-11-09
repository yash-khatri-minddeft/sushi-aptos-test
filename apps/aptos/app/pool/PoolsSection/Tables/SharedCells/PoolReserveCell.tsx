import React, { FC } from 'react'
import { Row } from './types'
import { Pool } from 'utils/usePools'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { classNames } from '@sushiswap/ui'
import { formatNumber } from 'utils/utilFunctions'

export const PoolReserveCell: FC<Row<Pool>> = ({ row }) => {
  const { token0, token1 } = useTokensFromPools(row)
  const reserve_x = formatNumber(Number(row.data.balance_x.value), token0.decimals)
  const reserve_y = formatNumber(Number(row.data.balance_y.value), token1.decimals)

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {reserve_x} {token0?.symbol} <span className="font-normal text-gray-900 dark:text-slate-500">/</span>{' '}
          {reserve_y} {token1?.symbol}{' '}
          <div className={classNames('text-[10px] bg-gray-200 dark:bg-slate-700 rounded-lg px-1 ml-1')}></div>
        </span>
      </div>
    </div>
  )
}
