export enum NetworksChainId {
  ethereum = "1",
  bnb = "56",
  arbitrum = "42161",
}

export interface NetworkData {
  name: string
  chainId: string
  currency: string
  rpcUrl: string
  blockExplorerUrl: string

}

export interface Balance {
  weiBalance: string
  ethBalance: string
}

export enum ErrorType {
  approve = "Error approving token",
  route = "Error getting swap route",
  buildTx = "Error building transaction",
  sendTx = "Error sending transaction",
}