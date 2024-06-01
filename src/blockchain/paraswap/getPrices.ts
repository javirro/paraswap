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
    options: {
      includeContractMethods: "multiswap",
    },
  }
  const url = new URL(baseURL)
  Object.keys(params).forEach(key => {
    const param = params[key as keyof typeof params]
    const paramValue = typeof param === "object" ? JSON.stringify(param) : param.toString()
    url.searchParams.append(key, paramValue)
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

  let fromDecimals, destDecimals: string
  if (from === "bnb") fromDecimals = "18"
  else {
    const tokenFromContract = new web3.eth.Contract(ABIS.token, fromAddress)
    fromDecimals = ((await tokenFromContract.methods.decimals().call()) as BigInt).toString()
  }
  if (to === "bnb") destDecimals = "18"
  else {
    const tokenToContract = new web3.eth.Contract(ABIS.token, destAddress)
    destDecimals = ((await tokenToContract.methods.decimals().call()) as BigInt).toString()
  }
  const amountWei: string = etherToWeiConverter(amountEth, fromDecimals)
  return { fromAddress, destAddress, amountWei, fromDecimals, destDecimals }
}

export const calculateParaswapTx = async (from: string, to: string, amountEth: string) => {
  const data: GetParaswapPricesParams = await prepareDataForParaswapPrices(from, to, amountEth)
  const priceRoute = await getParaswapPrices(data)
  return priceRoute
}
