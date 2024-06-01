import { useEffect, useState } from "react"
import { Balance } from "../../types/blockchain"
import InputForm from "../InputForm/InputForm"
import { EIP1193Provider } from "../../types/Metamask"
import { getBalance } from "../../blockchain/walletFunctions/getBalance"
import "./Swap.css"

interface SwapProps {
  provider: EIP1193Provider
  userAccount: string
  chainId: string
}
const Swap = ({ provider, userAccount, chainId }: SwapProps) => {
  const [balance, setBalance] = useState<Balance>({ weiBalance: "", ethBalance: "" })
  const [amount, setAmount] = useState<string>("")
  const [from, setFrom] = useState<string>("bnb")
  const [to, setTo] = useState<string>("usdt")

  const handleMaxAmount = () => {
    setAmount(balance?.ethBalance)
  }

  useEffect(() => {
    if (!provider) return
    getBalance(provider, from, userAccount, chainId)
      .then((b: Balance) => setBalance(b))
      .catch(e => {
        console.error("Error getting balance", e)
      })
  }, [provider, from, userAccount, chainId])

  
  return (
    <section id="swap">
      <InputForm amount={amount} setAmount={setAmount} userAccount={userAccount} from={from} setFrom={setFrom} handleMaxAmount={handleMaxAmount} />
    </section>
  )
}

export default Swap
