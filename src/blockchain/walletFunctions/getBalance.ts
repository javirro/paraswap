import { Web3 } from "web3"
import { EIP1193Provider } from "../../types/Metamask"
import { Balance } from "../../types/blockchain"
import { ABIS } from "../abis"
import { etherToWeiConverter } from "../tokenHelper"
import { tokenNameToAddress } from "../../utils/tokenNameToAddress"

export const getBalance = async (provider: EIP1193Provider, tokenFromName: string, userAddress: string, chainId: string): Promise<Balance> => {
  const web3 = new Web3(provider)
  const tokenAddress: string = tokenNameToAddress(tokenFromName)
  if (tokenFromName === "BNB" || tokenFromName === "bnb") {
    const weiBalance = (await web3.eth.getBalance(userAddress)).toString()
    const ethBalance = await web3.utils.fromWei(weiBalance, "ether")
    return { weiBalance, ethBalance }
  } else {
    const contract = new web3.eth.Contract(ABIS.token, tokenAddress)
    const balance = ((await contract.methods.balanceOf(userAddress).call()) as BigInt).toString()
    const decimals: string = ((await contract.methods.decimals().call()) as BigInt).toString()
    const ethBalance: string = etherToWeiConverter(balance, decimals)
    return { weiBalance: balance, ethBalance }
  }
}
