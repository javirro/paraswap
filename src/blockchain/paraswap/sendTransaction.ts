import { Web3 } from "web3"
import { EIP1193Provider } from "../../types/Metamask"
import { GetParaswapPricesParams } from "./getPrices"
import { TxInfoParaswap } from "../../types/paraswap"

export interface SendTransactionParams extends GetParaswapPricesParams {
  userAddress: string
  priceRoute: any
  slippage: number
}
const SendTransaction = async ({
  fromAddress,
  destAddress,
  amountWei,
  fromDecimals,
  destDecimals,
  userAddress,
  priceRoute,
  slippage,
}: SendTransactionParams): Promise<TxInfoParaswap> => {
  const baseURL = "https://apiv5.paraswap.io/transactions/56"
  const body = {
    srcToken: fromAddress,
    destToken: destAddress,
    srcAmount: amountWei,
    srcDecimals: +fromDecimals,
    destDecimals: +destDecimals,
    userAddress,
    receiver: userAddress,
    priceRoute,
    deadline: Math.floor(Date.now() / 1000) + 300,
    slippage,
  }
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }
  const response = await fetch(baseURL, options)
  if (response.status !== 200) throw new Error("Error sending transaction")
  const data: TxInfoParaswap = await response.json()
  return data
}

export default SendTransaction

export const swapWithParaswap = async (txInfo: TxInfoParaswap, provider: EIP1193Provider) => {
  const web3 = new Web3(provider)
  const { data, from: userAddress, value, to, gas, gasPrice } = txInfo
  const tx = await web3.eth.sendTransaction({
    from: userAddress.toLowerCase(),
    to: to.toLowerCase(),
    data,
    value: value !== "0" ? value : 0,
    gasPrice,
    gas,
  })
  return tx
}
