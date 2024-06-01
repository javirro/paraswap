import tokenList from "../blockchain/tokenList.json"

export const tokenNameToAddress = (tokenName: string): string => {
  const token = tokenList.find(t => t.id.toLowerCase() === tokenName.toLowerCase())
  if (token) return token.address.toLowerCase()
  return ""
}
