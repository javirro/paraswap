import Web3 from "web3"

//* https://web3js.readthedocs.io/en/v1.2.11/web3-utils.html#towei

export const etherToWeiConverter = (amount: string, tokenDecimals: string): string => {
  const defaultWeb3 = new Web3("https://binance.llamarpc.com")
  if(tokenDecimals === "18") {
    return defaultWeb3.utils.toWei(amount, "ether")
  } else if (tokenDecimals === "8") {
    return defaultWeb3.utils.toWei(amount, "gwei")
  } else if (tokenDecimals === "6") {
    return defaultWeb3.utils.toWei(amount, "mwei")
  } else if (tokenDecimals === "12") {
    return defaultWeb3.utils.toWei(amount, "kwei")
  } else return "0"
}

export const weiToEtherConverter = (amount: string, tokenDecimals: string): string => {
  const defaultWeb3 = new Web3("https://binance.llamarpc.com")
  if(tokenDecimals === "18") {
    return defaultWeb3.utils.fromWei(amount, "ether")
  } else if (tokenDecimals === "8") {
    return defaultWeb3.utils.fromWei(amount, "gwei")
  } else if (tokenDecimals === "6") {
    return defaultWeb3.utils.fromWei(amount, "mwei")
  } else if (tokenDecimals === "12") {
    return defaultWeb3.utils.fromWei(amount, "kwei")
  } else return "0"
}
