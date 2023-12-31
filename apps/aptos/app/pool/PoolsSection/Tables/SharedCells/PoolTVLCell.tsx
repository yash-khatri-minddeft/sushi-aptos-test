import React, { FC, useMemo } from 'react'
import { Row } from './types'
import { Pool } from 'utils/usePools'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import UseStablePrice from 'utils/useStablePrice'
import { formatUSD } from '@sushiswap/format'
import { formatNumber } from 'utils/utilFunctions'

export const PoolTVLCell: FC<Row<Pool>> = ({ row }) => {
  const { token0, token1 } = useTokensFromPools(row)
  const lpAddress = row?.id

  const [reserve0, reserve1] = useMemo(() => {
    return [row?.data?.balance_x?.value, row?.data?.balance_y?.value]
  }, [row])
  const token0Price = UseStablePrice(token0) ?? 0
  const token1Price = UseStablePrice(token1) ?? 0
  // const poolTvl = token0Price * Number(reserve0) + token1Price * Number(reserve1)
  const poolTvl =
    token0Price * Number(formatNumber(Number(reserve0), token0.decimals)) +
    token1Price * Number(formatNumber(Number(reserve1), token1.decimals))
  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {formatUSD(poolTvl)}
        </span>
      </div>
    </div>
  )
}
