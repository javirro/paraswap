import tokenList from "../../blockchain/tokenList.json"
import "./Form.css"

interface OutputFormProps {
  to: string
  from: string
  setTo: (from: string) => void
}

const OutputForm = ({ from, setTo, to }: OutputFormProps) => {
  const tokensNames: string[] = tokenList.map(t => t.id)
  const filteredTokens: string[] = tokensNames.filter(t => t.toLowerCase() !== from.toLowerCase())
  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value: string = e.target.value
    setTo(value.toLowerCase())
  }
  return (
    <section className='inputs'>
      <h4>To</h4>
      <div>
        <select onChange={handleToChange}>
          {filteredTokens.map(t => (
            <option value={t} key={t} selected={t === to}>
              {t.toUpperCase()}
            </option>
          ))}
        </select>
        <span className="preview">Estimating amount ....</span>
      </div>
    </section>
  )
}

export default OutputForm
