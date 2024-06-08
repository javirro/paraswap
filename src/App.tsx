import { useState } from "react"
import { EIP1193Provider } from "./types/Metamask"
import { hexToDecimal } from "./utils/numberConversion"
import DiscoverWalletProviders from "./components/DetectWallets/DetectWallets"
import Swap from "./components/Swap/Swap"
import Navbar from "./components/Navbar/Navbar"

import "./App.css"

function App() {
  const [provider, setProvider] = useState<EIP1193Provider>()
  const [userAccount, setUserAccount] = useState<string>("")
  const [chainId, setChainId] = useState<string>("56")
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  provider?.on?.("accountsChanged", (accounts: any) => {
    setUserAccount(accounts[0])
  })

  provider?.on?.("chainChanged", (hexChainId: any) => {
    const decChainId: string = hexToDecimal(hexChainId).toString()
    setChainId(decChainId)
  })

  return (
    <div className="App">
      {openWalletModal && (
        <DiscoverWalletProviders
          setOpenWalletModal={setOpenWalletModal}
          provider={provider as EIP1193Provider}
          setProvider={setProvider}
          setUserAccount={setUserAccount}
          userAccount={userAccount}
          chaindId={chainId}
        />
      )}
      <Navbar setOpenWalletModal={setOpenWalletModal} userAccount={userAccount} chainId={chainId} />
      {provider && <Swap provider={provider} userAccount={userAccount} chainId={chainId} />}
    </div>
  )
}

export default App
