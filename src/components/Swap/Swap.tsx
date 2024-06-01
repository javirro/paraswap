import { useEffect, useState } from "react"
import { Balance } from "../../types/blockchain"
import InputForm from "../Form/InputForm"
import { EIP1193Provider } from "../../types/Metamask"
import { getBalance } from "../../blockchain/walletFunctions/getBalance"
import OutputForm from "../Form/OutputForm"
import { calculateParaswapTx } from "../../blockchain/paraswap/getPrices"
import { weiToEtherConverter } from "../../blockchain/tokenHelper"
import { approveToken, getAllowance } from "../../blockchain/approveAllowance"

import "./Swap.css"
import sendTransaction, { SendTransactionParams, swapWithParaswap } from "../../blockchain/paraswap/sendTransaction"

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
  const [preview, setPreview] = useState<string>("Estimating amount ....")
  const [priceRoute, setPriceRoute] = useState<any>(undefined)

  const handleMaxAmount = () => {
    setAmount(balance?.ethBalance)
  }

  useEffect(() => {
    setAmount("0")
  }, [from])

  useEffect(() => {
    if (!provider) return
    getBalance(provider, from, userAccount, chainId)
      .then((b: Balance) => setBalance(b))
      .catch(e => {
        console.error("Error getting balance", e)
      })
  }, [provider, from, userAccount, chainId])

  const sendTx = async () => {
    const spender: string = priceRoute.tokenTransferProxy
    const srcToken: string = priceRoute.srcToken
    const amountWei: string = priceRoute.srcAmount
    try {
      const allowance: string = await getAllowance(provider, userAccount, spender, srcToken)
      if (BigInt(allowance) < BigInt(amountWei)) {
        await approveToken(provider, userAccount, spender, amountWei, srcToken)
      }
    } catch (error) {
      console.error("Error approving token", error)
    }

    let txInfo
    try {
      const txParams: SendTransactionParams = {
        userAddress: userAccount,
        fromAddress: srcToken,
        destAddress: priceRoute.destToken,
        amountWei,
        fromDecimals: priceRoute.srcDecimals,
        destDecimals: priceRoute.destDecimals,
        priceRoute,
        slippage: 250,
      }
      console.log("Sending transaction", txParams)
      txInfo = await sendTransaction(txParams)
    } catch (error) {
      console.error("Error getting data for tx", error)
    }

    try {
      const tx = await swapWithParaswap(txInfo.data, txInfo.to, provider, userAccount)
      console.log("Transaction sent", tx)
    } catch (error) {
      console.error("Error sending transaction", error)
    }
  }

  useEffect(() => {
    if (amount === "" || amount === "0") return
    calculateParaswapTx(from, to, amount)
      .then(res => {
        setPriceRoute(res)
        const destDecimals = res?.destDecimals
        const destAmountWei = res?.destAmount
        if (!destDecimals || !destAmountWei) return
        setPreview(weiToEtherConverter(destAmountWei, destDecimals))
      })
      .catch(e => console.error(e))
  }, [from, amount, to])

  return (
    <section id="swap">
      <section className="form-container">
        <section className="input-container">
          <InputForm amount={amount} setAmount={setAmount} userAccount={userAccount} from={from} setFrom={setFrom} handleMaxAmount={handleMaxAmount} />
          <OutputForm to={to} from={from} setTo={setTo} preview={preview} />
        </section>
        <button className="swap-btn" onClick={sendTx} disabled={!priceRoute}>
          SWAP
        </button>
      </section>
    </section>
  )
}

export default Swap
