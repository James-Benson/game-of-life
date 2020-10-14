import * as React from 'react'

/** copyElementText copies text of elementRef  */
export function useCopyElementText(): [React.MutableRefObject<any>, () => void] {
  const elementRef = React.useRef<any>()

  const copyElementText = React.useCallback(() => {
    if (!elementRef.current?.innerText) return
    navigator.clipboard.writeText(elementRef.current.innerText)
  }, [elementRef])

  return [elementRef, copyElementText]
}