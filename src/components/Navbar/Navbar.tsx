import { formatAddress } from "../../utils/formatAddress"
import "./Navbar.css"

interface NavbarProps {
  setOpenWalletModal: (open: boolean) => void
  userAccount: string
  chainId: string
}

const Navbar = ({ setOpenWalletModal, userAccount, chainId }: NavbarProps) => {
  const isConnected: boolean = userAccount !== ""
  return (
    <nav>
      <div className="content">
        <strong>Network: {chainId}</strong>
        {!isConnected ? (
          <button className="connect" onClick={() => setOpenWalletModal(true)}>
            Connect Wallet{" "}
          </button>
        ) : (
          <span> {formatAddress(userAccount)}</span>
        )}
      </div>
    </nav>
  )
}

export default Navbar
