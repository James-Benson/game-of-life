import * as React from "react"

/** copyElementText copies text of elementRef  */
export function useCopyElementText<T extends HTMLElement>(): [
  React.MutableRefObject<T | null>,
  () => void
] {
  const elementRef = React.useRef<T>(null)

  const copyElementText = React.useCallback(() => {
    if (elementRef.current?.innerText) {
      void navigator.clipboard.writeText(elementRef.current.innerText)
    }
  }, [elementRef])

  return [elementRef, copyElementText]
}
