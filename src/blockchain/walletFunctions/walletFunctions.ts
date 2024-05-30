import { EIP1193Provider } from "../../types/Metamask"
import { decimalToHex } from "../../utils/numberConversion"

export const getChaindId = async (provider: EIP1193Provider): Promise<string> => {
  const hexChainId = (await provider.request({ method: "eth_chainId" })) as string
  return hexChainId
}

export const getWalletAccounts = async (provider: EIP1193Provider): Promise<string[]> => {
  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[]
  return accounts
}

export const switchChain = async (provider: EIP1193Provider, chainId: string): Promise<void> => {
  const hexSelectedChainId: string = decimalToHex(+chainId)
  await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x" + hexSelectedChainId }] })
}