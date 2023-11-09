import { maxBy, uniqBy } from 'lodash'
import { Token } from './tokenType'
import { Pair, PairState } from './usePairs'

export default function getCurrencyPrice(
  currency: Token,
  defaultStable: Token,
  native: Token,
  stableTokens: Token[],
  nativePairInfo: [PairState, Pair | null] | undefined,
  stableNativePairInfo: [PairState, Pair | null] | undefined,
  stablePairsInfo: [PairState, Pair | null][]
) {
  if (!currency || !defaultStable || !native || !stableTokens.filter(Boolean).length) {
    return undefined
  }
  const bestStablePair = maxBy(
    uniqBy(
      stablePairsInfo.filter(
        ([stablePairState, stablePair]) =>
          stablePair &&
          stablePairState === PairState.EXISTS &&
          Number(stablePair.tokenAmounts[0]) > 0 &&
          Number(stablePair.tokenAmounts[1]) > 0
      ),
      'liquidityToken.address'
    ).map(([, stablePair]) => stablePair),
    (stablePair) => {
      const stablePairToken = stableTokens.find((stableToken) => involvesToken(stablePair, stableToken))
      const stablePairTokenAmount = stablePairToken && stablePair ? reserveOf(stablePair, stablePairToken) : null
      if (stablePairToken && stablePairTokenAmount) {
        return parseInt(stablePairTokenAmount)
      }
      return 0
    }
  )

  if (currency.address == native.address) {
    if (bestStablePair) {
      const price = priceOf(bestStablePair, native)
      const stablePairToken = stableTokens.find((stableToken) => involvesToken(bestStablePair, stableToken))
      if (stablePairToken) return price
    }
    return undefined
  }
  // handle stable
  if (currency.address == defaultStable.address) {
    return 1
  }
  const [nativePairState, nativePair] = nativePairInfo || []
  const [stableNativePairState, stableNativePair] = stableNativePairInfo || []
  const isNativePairExist =
    nativePair &&
    nativePairState === PairState.EXISTS &&
    Number(nativePair.tokenAmounts[0]) > 0 &&
    Number(nativePair.tokenAmounts[1]) > 0
  const isStableNativePairExist =
    stableNativePair &&
    stableNativePairState === PairState.EXISTS &&
    Number(stableNativePair.tokenAmounts[0]) > 0 &&
    Number(stableNativePair.tokenAmounts[1]) > 0

  const nativePairNativeAmount = isNativePairExist && reserveOf(nativePair, native)
  const nativePairNativeStableValue =
    nativePairNativeAmount && bestStablePair && isStableNativePairExist ? priceOf(stableNativePair, native) : 0

  if (bestStablePair) {
    const stablePairToken = stableTokens.find((stableToken) => involvesToken(bestStablePair, stableToken))
    if (stablePairToken && Number(reserveOf(bestStablePair, stablePairToken)) > nativePairNativeStableValue) {
      const price = priceOf(bestStablePair, currency)
      return price
      // return new Price(currency, stablePairToken, price.denominator, price.numerator)
    }
  }

  if (isNativePairExist && isStableNativePairExist) {
    if (Number(reserveOf(stableNativePair, defaultStable)) > 0 && Number(reserveOf(nativePair, native)) > 0) {
      const nativeStablePrice = priceOf(stableNativePair, defaultStable)
      const currencyNativePrice = priceOf(nativePair, native)
      const stablePrice = (1 / nativeStablePrice) * currencyNativePrice
      // return new Price(currency, defaultStable, stablePrice.denominator, stablePrice.numerator)
      return stablePrice
    }
  }
  return undefined
}

function involvesToken(
  stablePair: { liquidityToken: Token; tokenAmounts: string[]; token0: Token; token1: Token } | null,
  stableToken: Token
) {
  return stablePair?.token0.address == stableToken.address || stablePair?.token1.address == stableToken.address
}
function reserveOf(
  pair: {
    liquidityToken: Token
    tokenAmounts: string[]
    token0: Token
    token1: Token
  },
  pairToken: Token
) {
  return pair.token0.address == pairToken.address ? pair.tokenAmounts[0] : pair.tokenAmounts[1]
}

function priceOf(pair: Pair, token: Token) {
  return pair.token0.address == token.address ? getToken0Price(pair.tokenAmounts) : getToken1Price(pair.tokenAmounts)
}

function getToken0Price(tokenAmount: string[]) {
  return Number(tokenAmount[1]) / Number(tokenAmount[0])
}

function getToken1Price(tokenAmount: string[]) {
  return Number(tokenAmount[0]) / Number(tokenAmount[1])
}
