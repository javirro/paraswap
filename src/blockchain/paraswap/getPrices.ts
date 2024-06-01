import { Web3 } from "web3"
import { tokenNameToAddress } from "../../utils/tokenNameToAddress"
import { ABIS } from "../abis"
import { etherToWeiConverter } from "../tokenHelper"

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

export const prepareDataForParaswapPrices = async (from: string, to: string, amountEth: string): Promise<GetParaswapPricesParams> => {
  const fromAddress: string = tokenNameToAddress(from)
  const destAddress: string = tokenNameToAddress(to)
  const web3 = new Web3("https://binance.llamarpc.com")
  const tokenFromContract = new web3.eth.Contract(ABIS.token, fromAddress)
  const tokenToContract = new web3.eth.Contract(ABIS.token, destAddress)
  const fromDecimals: string = (await tokenFromContract.methods.decimals().call() as BigInt).toString()
  const destDecimals: string = (await tokenToContract.methods.decimals().call() as BigInt).toString()
  const amountWei: string = etherToWeiConverter(amountEth, fromDecimals)
  return { fromAddress,  destAddress, amountWei, fromDecimals, destDecimals }
}

export const calculateParaswapTx = async (from: string, to: string, amountEth: string) => {
  const data: GetParaswapPricesParams = await prepareDataForParaswapPrices(from, to, amountEth)
  const priceRoute = await getParaswapPrices(data)
  return priceRoute
}
