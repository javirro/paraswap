import { useState } from "react"
import { EIP1193Provider } from "./types/Metamask"
import { hexToDecimal } from "./utils/numberConversion"
import DiscoverWalletProviders from "./components/DetectWallets/DetectWallets"

import "./App.css"


function App() {
  const [provider, setProvider] = useState<EIP1193Provider>()
  const [userAccount, setUserAccount] = useState<string>("")
  const [chainId, setChainId] = useState<string>("56")
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(true)
  provider?.on?.("accountsChanged", (accounts: any) => {
    setUserAccount(accounts[0]);
  });

  provider?.on?.("chainChanged", (hexChainId: any) => {
    const decChainId: string = hexToDecimal(hexChainId).toString();
    setChainId(decChainId);
  });

  return (
    <div className="App">
      {openWalletModal && (
        <DiscoverWalletProviders
          setOpenWalletModal={setOpenWalletModal}
          setProvider={setProvider}
          setUserAccount={setUserAccount}
          userAccount={userAccount}
          chaindId={chainId}
        />
      )}
    </div>
  );
}

export default App;
