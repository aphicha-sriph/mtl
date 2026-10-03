import { useEffect, type RefObject } from 'react'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

interface DialogFocusOptions {
  active: boolean
  containerRef: RefObject<HTMLElement | null>
  initialFocusRef?: RefObject<HTMLElement | null>
  onClose: () => void
}

export function useDialogFocus({
  active,
  containerRef,
  initialFocusRef,
  onClose,
}: DialogFocusOptions) {
  useEffect(() => {
    if (!active) return

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const priorOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusFrame = window.requestAnimationFrame(() => {
      const firstFocusable = containerRef.current?.querySelector<HTMLElement>(focusableSelector)
      ;(initialFocusRef?.current ?? firstFocusable ?? containerRef.current)?.focus()
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !containerRef.current) return

      const focusableElements = [...containerRef.current.querySelectorAll<HTMLElement>(focusableSelector)]
        .filter((element) => !element.hasAttribute('hidden') && element.getClientRects().length > 0)
      const first = focusableElements.at(0)
      const last = focusableElements.at(-1)

      if (!first || !last) {
        event.preventDefault()
        containerRef.current.focus()
        return
      }

      if (event.shiftKey && (document.activeElement === first || !containerRef.current.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = priorOverflow
      window.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [active, containerRef, initialFocusRef, onClose])
}
