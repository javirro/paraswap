import { useEffect, useState } from "react"
import { Balance } from "../../types/blockchain"
import InputForm from "../Form/InputForm"
import { EIP1193Provider } from "../../types/Metamask"
import { getBalance } from "../../blockchain/walletFunctions/getBalance"
import "./Swap.css"
import OutputForm from "../Form/OutputForm"

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
      <form>
        <section className="input-container">
          <InputForm amount={amount} setAmount={setAmount} userAccount={userAccount} from={from} setFrom={setFrom} handleMaxAmount={handleMaxAmount} />
          <OutputForm to={to} from={from} setTo={setTo} />
        </section>
        <button type="submit">SWAP</button>
      </form>
    </section>
  )
}

export default Swap
