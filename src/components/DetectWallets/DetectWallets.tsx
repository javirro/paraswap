import useSyncProviders from "../../hooks/useSyncProviders"
import { EIP1193Provider, EIP6963ProviderDetail } from "../../types/Metamask"
import useCloseModalClickOut from "../../hooks/useCloseModalClickOut"
import { hexToDecimal } from "../../utils/numberConversion"
import { getChaindId, getWalletAccounts, switchChain } from "../../blockchain/walletFunctions/walletFunctions"

import "./DetectWallets.css"


interface DiscoverWalletProvidersProps {
  setProvider: (provider: EIP1193Provider) => void
  setUserAccount: (userAccount: string) => void
  setOpenWalletModal: (openWalletModal: boolean) => void
  userAccount: string
  chaindId: string
}

const DiscoverWalletProviders = ({ setProvider, setUserAccount, userAccount, chaindId, setOpenWalletModal }: DiscoverWalletProvidersProps) => {
  const providers = useSyncProviders()

  const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
    setProvider(providerWithInfo.provider)
    try {
      const accounts: string[] = await getWalletAccounts(providerWithInfo.provider)
      if (accounts?.[0] as string) {
        setUserAccount(accounts?.[0])
      }
    } catch (error) {
      console.error("Error getting user account", error)
    }

    try {
      const hexChainId: string = await getChaindId(providerWithInfo.provider)
      if (hexChainId) {
        const userChainId: string = hexToDecimal(hexChainId).toString()
        if (userChainId === chaindId) {
          setTimeout(() => {
            setOpenWalletModal(false)
          }, 1500)
        } else {
          try {
            await switchChain(providerWithInfo.provider, chaindId)
          } catch (switchError) {
            console.error("Error switch chain because network is not added to metamask", switchError)
          }
        }
      }
    } catch (error) {
      console.error("Error getting chainId", error)
    }
  }

  const modalRef = useCloseModalClickOut(setOpenWalletModal)
  return (
    <div id="modal-detection">
      <section className="wallets-detection" ref={modalRef}>
        <h2>Wallets Detected</h2>
        <div>
          {providers.length > 0 ? (
            providers?.map((provider: EIP6963ProviderDetail) => (
              <button key={provider.info.uuid} onClick={() => handleConnect(provider)}>
                <img src={provider.info.icon} alt={provider.info.name} />
                <strong>{provider.info.name}</strong>
              </button>
            ))
          ) : (
            <div>There are no announced providers.</div>
          )}
        </div>

        {userAccount && userAccount !== "" && (
          <div>
            <span>{userAccount}</span>
          </div>
        )}
      </section>
    </div>
  )
}
export default DiscoverWalletProviders
