import { useEffect, useRef, type RefObject } from 'react'

/**
 * Accessibilite minimale partagee par la modale de formulaire et la boite de
 * confirmation : fermeture sur Echap, focus pose sur `initialFocusRef` a
 * l'ouverture, et restitue a l'element declencheur a la fermeture.
 */
export function useDialogA11y(
  isOpen: boolean,
  onClose: () => void,
  initialFocusRef: RefObject<HTMLElement>,
) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const triggerElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    triggerElementRef.current = document.activeElement as HTMLElement | null
    initialFocusRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCloseRef.current()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      triggerElementRef.current?.focus()
    }
  }, [isOpen, initialFocusRef])
}
