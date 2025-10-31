export const goPlusUrl = (token: string) =>
  `https://gopluslabs.io/token-security/1/${token}`
export const etherscanUrl = (address: string) =>
  `https://etherscan.io/address/${address}`
export const etherscanTxUrl = (tx: string) => `https://etherscan.io/tx/${tx}`
export const coinGeckoUrl = (webSlug: string) =>
  `https://www.coingecko.com/en/coins/${webSlug}`
export const uniswapInfoUrl = (address: string) =>
  `https://app.uniswap.org/explore/tokens/ethereum/${address}`

export const openInNewTab = (url) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer")
  if (newWindow) newWindow.opener = null
}
