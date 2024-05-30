import { useSyncExternalStore } from "react"
import { store } from "./store"
import { EIP6963ProviderDetail } from "../types/Metamask"

const useSyncProviders = (): EIP6963ProviderDetail[] => {
  const providers = useSyncExternalStore(store.subscribe, store.value, store.value)
  return providers
}

export default useSyncProviders
