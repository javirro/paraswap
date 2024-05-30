import {  useEffect, useRef } from "react";

const useCloseModalClickOut = (closeModal: (s: boolean) => void) => {
  const modalRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [closeModal])

  return modalRef
}

export default useCloseModalClickOut