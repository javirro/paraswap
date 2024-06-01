import Web3 from "web3"
import { EIP1193Provider } from "../types/Metamask"
import { ABIS } from "./abis"

export const approveToken = async (provider: EIP1193Provider, userAddress: string, spender: string, amountWei: string, tokenAddress: string) => {
  const web3 = new Web3(provider)
  const tokenContract = new web3.eth.Contract(ABIS.token, tokenAddress)
  await tokenContract.methods.approve(spender, amountWei).send({ from: userAddress })
}

export const getAllowance = async (provider: EIP1193Provider, userAddress: string, spender: string, tokenAddress: string): Promise<number> => {
  const web3 = new Web3(provider)
  const tokenContract = new web3.eth.Contract(ABIS.token, tokenAddress)
  const allowance: number = await tokenContract.methods.allowance(userAddress, spender).call()
  return allowance
}
