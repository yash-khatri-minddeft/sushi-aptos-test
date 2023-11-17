import { FC, useMemo } from 'react'
import { Row } from './types'
import { Pool } from 'utils/usePools'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import UseStablePrice from 'utils/useStablePrice'
import { formatUSD } from '@sushiswap/format'
import { formatNumber } from 'utils/utilFunctions'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useTokenBalance } from 'utils/useTokenBalance'
import { useTotalSupply } from 'utils/useTotalSupply'

const CONTRACT_ADDRESS = process.env['NEXT_PUBLIC_SWAP_CONTRACT'] || process.env['SWAP_CONTRACT']

export const PoolMyPositionTVLCell: FC<Row<Pool>> = ({ row }) => {
  const { token0, token1 } = useTokensFromPools(row)

  const { account } = useWallet()

  const { data: liquidityBalance, isInitialLoading: isLoadingBalance } = useTokenBalance({
    account: account?.address as string,
    currency: `${CONTRACT_ADDRESS}::swap::LPToken<${row?.data?.token_x_details.token_address},${row?.data?.token_y_details.token_address}>`,
    enabled: true,
    refetchInterval: 2000,
  })

  const { data: coinInfo } = useTotalSupply(
    `${row?.data?.token_x_details.token_address},${row?.data?.token_y_details.token_address}`
  )

  const totalSupply = coinInfo?.data?.supply?.vec?.[0]?.integer?.vec?.[0]?.value

  const [reserve0, reserve1] = useMemo(() => {
    return [row?.data?.balance_x?.value, row?.data?.balance_y?.value]
  }, [row])

  const currencyABalance = useMemo(() => {
    return token0
      ? liquidityBalance
        ? Math.floor((Number(reserve0) * Math.floor(liquidityBalance)) / Number(totalSupply))
        : 0
      : undefined
  }, [liquidityBalance, reserve0, totalSupply])

  const currencyBBalance = useMemo(() => {
    return token1
      ? liquidityBalance
        ? Math.floor((Number(reserve1) * Math.floor(liquidityBalance)) / Number(totalSupply))
        : 0
      : undefined
  }, [liquidityBalance, reserve1, totalSupply])

  const token0Price = UseStablePrice(token0) ?? 0
  const token1Price = UseStablePrice(token1) ?? 0
  const token0TvlPrice = token0Price ? (token0Price * Number(reserve0)) / 10 ** token0.decimals : 0
  const token1TvlPrice = token1Price ? (token1Price * Number(reserve1)) / 10 ** token1.decimals : 0
  // const token0MyPositionTvlPrice =
  //   token0TvlPrice * Number(formatNumber(Number(reserve0), token0.decimals)) +
  //   token1TvlPrice * Number(formatNumber(Number(reserve1), token1.decimals))
  const userPositionTvl =
    token0Price * Number(formatNumber(Number(currencyABalance), token0.decimals)) +
    token1Price * Number(formatNumber(Number(currencyBBalance), token1.decimals))

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {currencyABalance && currencyBBalance ? formatUSD(userPositionTvl) : formatUSD(0)}
        </span>
      </div>
    </div>
  )
}
