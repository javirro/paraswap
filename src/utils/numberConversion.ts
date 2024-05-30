export const decimalToHex = (dec: number): string => {
  return "0x" + dec.toString(16)
}


export const hexToDecimal = (hex: string): number => {
  return parseInt(hex.slice(2), 16)
}