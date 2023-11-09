import { Typography } from '@sushiswap/ui'
import { FC, useMemo } from 'react'
import { PoolPositionDesktop } from './PoolPositionDesktop'
import { PoolPositionStakedDesktop } from './PoolPositionStakedDesktop'
import { Pool } from 'utils/usePools'
import { useBreakpoint } from '@sushiswap/hooks'
import { formatUSD } from '@sushiswap/format'
import UseStablePrice from 'utils/useStablePrice'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { useUnderlyingTokenBalanceFromPool } from 'utils/useUnderlyingTokenBalanceFromPool'
import { useTotalSupply } from 'utils/useTotalSupply'
import { useTokenBalance } from 'utils/useTokenBalance'
import { useWallet } from '@aptos-labs/wallet-adapter-react'

interface PoolPositionProps {
  row: Pool
  isLoading: boolean
  stakeAmount: number
}

const CONTRACT_ADDRESS = process.env['SWAP_CONTRACT'] || process.env['NEXT_PUBLIC_SWAP_CONTRACT']

export const PoolPosition: FC<PoolPositionProps> = ({ row, isLoading, stakeAmount }) => {
  const { isLg } = useBreakpoint('lg')
  const { token0, token1 } = useTokensFromPools(row)
  const { account } = useWallet()
  const tokenAddress = row?.id
  const { data: LPBalancecoinInfo } = useTotalSupply(tokenAddress)
  const [reserve0, reserve1] = useMemo(() => {
    return [row?.data?.balance_x?.value, row?.data?.balance_y?.value]
  }, [row])

  const { data: LPBalance, isLoading: isBalanceLoading } = useTokenBalance({
    account: account?.address as string,
    currency: `${CONTRACT_ADDRESS}::swap::LPToken<${tokenAddress}>`,
    enabled: true,
    refetchInterval: 2000,
  })
  const { data: coinInfo, isLoading: isLoadingSupply } = useTotalSupply(tokenAddress)
  const totalSupply = coinInfo?.data?.supply?.vec?.[0]?.integer?.vec?.[0]?.value
  const [underlying0, underlying1] = useUnderlyingTokenBalanceFromPool({
    balance: LPBalance,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    totalSupply: Number(totalSupply),
    decimals: coinInfo?.data?.decimals,
  })
  const [stakedUnderlying0, stakedUnderlying1] = useUnderlyingTokenBalanceFromPool({
    balance: stakeAmount,
    reserve0: Number(reserve0),
    reserve1: Number(reserve1),
    totalSupply: Number(totalSupply),
    decimals: coinInfo?.data?.decimals,
  })
  const token0Price = UseStablePrice(token0)
  const token1Price = UseStablePrice(token1)
  const token0UnstakedInUsd = token0Price ? token0Price * Number(underlying0) : 0
  const token1UnstakedInUsd = token1Price ? token1Price * Number(underlying1) : 0
  const token0StakedInUsd = token0Price ? token0Price * Number(stakedUnderlying0) : 0
  const token1StakedInUsd = token1Price ? token1Price * Number(stakedUnderlying1) : 0

  if (!isLg) return <></>
  return (
    <div className="flex flex-col dark:bg-slate-800 rounded-2xl bg-white">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-900/5 dark:border-slate-200/5">
        <Typography weight={600} className="text-gray-900 dark:text-slate-50">
          My Position
        </Typography>
        <div className="flex flex-col">
          <Typography variant="sm" weight={600} className="text-right dark:text-slate-50 text-gray-900">
            {formatUSD(token0StakedInUsd + token1StakedInUsd + token0UnstakedInUsd + token1UnstakedInUsd)}
          </Typography>
        </div>
      </div>
      <PoolPositionDesktop
        row={row}
        isLoading={isLoading || isBalanceLoading || isLoadingSupply}
        underlying0={underlying0}
        underlying1={underlying1}
        value0={token0UnstakedInUsd}
        value1={token1UnstakedInUsd}
      />
      <PoolPositionStakedDesktop
        row={row}
        isLoading={isLoading || isBalanceLoading || isLoadingSupply}
        underlying0={stakedUnderlying0}
        underlying1={stakedUnderlying1}
        value0={token0StakedInUsd}
        value1={token0StakedInUsd}
      />
    </div>
  )
}
