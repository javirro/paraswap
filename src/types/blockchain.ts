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