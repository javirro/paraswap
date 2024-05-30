import {
  EIP6963ProviderDetail,
  EIP6963AnnounceProviderEvent,
} from "../types/Metamask";

declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent;
  }
}

let providers: EIP6963ProviderDetail[] = [];

export const store = {
  value: () => providers,
  subscribe: (callback: () => void) => {
    function onAnnouncement(event: EIP6963AnnounceProviderEvent) {
      const uuidProviderList: string[] = providers.map((p) => p.info.uuid)
      if (uuidProviderList.includes(event.detail.info.uuid)) return;
      providers = [...providers, event.detail]
      callback()
    }
    window.addEventListener("eip6963:announceProvider", onAnnouncement);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () =>
      window.removeEventListener("eip6963:announceProvider", onAnnouncement);
  },
};
