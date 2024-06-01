export interface GetParaswapPricesParams {
  fromAddress: string
  destAddress: string
  amountWei: string
  fromDecimals: string
  destDecimals: string
}
export const getParaswapPrices = async ({ fromAddress, destAddress, amountWei, fromDecimals, destDecimals }: GetParaswapPricesParams) => {
  const baseURL = "https://apiv5.paraswap.io/prices/"
  const params = {
    srcToken: fromAddress,
    destToken: destAddress,
    amount: amountWei,
    srcDecimals: fromDecimals,
    destDecimals: destDecimals,
    side: "SELL",
    network: "56",
  }
  const url = new URL(baseURL)
  Object.keys(params).forEach(key => {
    const param = params[key as keyof typeof params]
    url.searchParams.append(key, param)
  })

  const response = await fetch(url.toString())
  const data = await response.json()
  const priceRoute = data.priceRoute
  return priceRoute
}
