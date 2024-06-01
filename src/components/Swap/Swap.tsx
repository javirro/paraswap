import { useEffect, useState } from "react"
import { Balance, ErrorType } from "../../types/blockchain"
import InputForm from "../Form/InputForm"
import { EIP1193Provider } from "../../types/Metamask"
import { getBalance } from "../../blockchain/walletFunctions/getBalance"
import OutputForm from "../Form/OutputForm"
import { calculateParaswapTx } from "../../blockchain/paraswap/getPrices"
import { weiToEtherConverter } from "../../blockchain/tokenHelper"
import { approveToken, getAllowance } from "../../blockchain/approveAllowance"
import BuildTxData, { SendTransactionParams, swapWithParaswap } from "../../blockchain/paraswap/sendTransaction"
import { TransactionReceipt } from "web3"

import "./Swap.css"
import { TxInfoParaswap } from "../../types/paraswap"

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
  const [txHash, setTxHash] = useState<string>("")
  const [error, setError] = useState<ErrorType | undefined>(undefined)

  const handleMaxAmount = () => {
    setAmount(balance?.ethBalance)
  }

  useEffect(() => {
    setError(undefined)
    setAmount("0")
    setPreview("Estimating amount ....")
    setTxHash("")
  }, [from])

  useEffect(() => {
    setError(undefined)
    setPreview("Estimating amount ....")
    setTxHash("")
  }, [to])

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
    if (from !== "bnb") {
      try {
        const allowance: string = await getAllowance(provider, userAccount, spender, srcToken)
        if (BigInt(allowance) < BigInt(amountWei)) {
          await approveToken(provider, userAccount, spender, amountWei, srcToken)
        }
      } catch (error) {
        console.error("Error approving token", error)
        setError(ErrorType.approve)
        return
      }
    }

    let txInfo: TxInfoParaswap
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
      txInfo = await BuildTxData(txParams)
    } catch (error) {
      console.error("Error getting data for tx", error)
      setError(ErrorType.buildTx)
      return
    }

    try {
      const tx: TransactionReceipt = await swapWithParaswap(txInfo, provider)
      setTxHash(tx.transactionHash.toString())
    } catch (error) {
      setError(ErrorType.sendTx)
      console.error("Error sending transaction", error)
      return
    } finally {
      setPriceRoute(undefined)
      setAmount("0")
      setPreview("0")
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
        setPreview(parseFloat(weiToEtherConverter(destAmountWei, destDecimals.toString())).toFixed(6))
      })
      .catch(e => {
        console.error(e)
        setError(ErrorType.route)
      })
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
        {txHash && txHash !== "" && (
          <section className="tx-hash">
            <a href={`https://bscscan.com/tx/${txHash}`} target="_blank" rel="noreferrer">
              Explore transaction in BSCSCAN
            </a>
          </section>
        )}
        {error && <span className="error">{error}</span>}
      </section>
    </section>
  )
}

export default Swap
