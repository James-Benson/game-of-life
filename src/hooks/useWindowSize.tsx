import * as React from 'react'

interface IDimensions {
  screenWidth: number
  screenHeight: number
}

/**
 * Updates window size when it has not changed in set amount of time
 * @param delay Time to wait in milliseconds before updating state
 */
export function useWindowSize(delay: number): IDimensions {
  const [screenSize, setScreenSize] = React.useState<IDimensions>({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
  })

  React.useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined
    const resizeListener = () => {
      if (timer) clearTimeout(timer)

      timer = setTimeout(() => {
        setScreenSize({
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight
        })
      }, delay)
    }

    window.addEventListener('resize', resizeListener)
    return () => {
      window.removeEventListener('resize', resizeListener)
    }
  }, [])

  return screenSize
}