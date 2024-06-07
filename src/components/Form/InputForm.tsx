import tokenList from "../../blockchain/tokenList.json"
import "./Form.css"

interface InputFormProps {
  chainId?: string
  amount: string
  setAmount: (amount: string) => void
  userAccount: string
  from: string
  setFrom: (from: string) => void
  handleMaxAmount: Function
  slippage: number
  setSlippage: (slippage: number) => void
}
const InputForm = ({ amount, setAmount, userAccount, from, setFrom, handleMaxAmount, slippage, setSlippage }: InputFormProps) => {
  const tokensNames: string[] = tokenList.map(t => t.id)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const splited = value.split(".")
    if (splited.length > 1 && splited[1].length > 9) return
    setAmount(e.target.value)
  }

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value: string = e.target.value
    setFrom(value.toLowerCase())
  }

  const handleSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setSlippage(value)
  }

  return (
    <section className="inputs">
      <div className="header">
        <h4>From</h4>
        <div className="slippage">
          <span> (%) Slippage</span>
          <input type="number" placeholder="0.5" min={0.1} step={0.1} max={10} value={slippage} onChange={handleSlippageChange}/>
        </div>
      </div>

      <div>
        <select onChange={handleFromChange}>
          {tokensNames.map(t => (
            <option value={t} key={t} selected={t === from}>
              {t.toUpperCase()}
            </option>
          ))}
        </select>
        <input type="text" placeholder="0.0" value={amount} onChange={handleAmountChange} />
        <button className="max" type="button" onClick={() => handleMaxAmount()} disabled={!userAccount}>
          MAX
        </button>
      </div>
    </section>
  )
}

export default InputForm
