import * as React from "react"

/**
 * Runs a callback at set number of frames per second, limited by number of frames your browser can render per second
 * @param fps
 * @param callback
 */
export function useAnimationFrame(
  fps: number,
  callback: () => void
): [() => void, boolean, () => void] {
  const animationRef = React.useRef(0)
  const prevTimeRef = React.useRef<number>()
  const countRef = React.useRef(0)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const [reanimate, setReanimate] = React.useState(false)

  const animate = React.useCallback(
    (time: number) => {
      if (prevTimeRef.current) {
        const deltaTime = time - prevTimeRef.current
        countRef.current += deltaTime
        if (countRef.current > 1000 / fps) {
          countRef.current = countRef.current - 1000 / fps
          callback()
        }
      } else {
        countRef.current = 0
        callback()
      }
      prevTimeRef.current = time
      animationRef.current = requestAnimationFrame(time => animate(time))
    },
    [callback, fps]
  )

  /** Pauses animation if playing, plays if paused */
  const toggleAnimation = React.useCallback(() => {
    if (isAnimating) {
      cancelAnimationFrame(animationRef.current)
    } else {
      prevTimeRef.current = undefined
      animationRef.current = requestAnimationFrame(time => animate(time))
    }
    setIsAnimating(prev => !prev)
  }, [isAnimating, animate])

  /** Pauses animation, then plays after any setStates you call have applied */
  const tempPause = React.useCallback(() => {
    if (isAnimating) {
      setReanimate(true)
      toggleAnimation()
    }
  }, [isAnimating, toggleAnimation])
  React.useEffect(() => {
    if (reanimate) {
      setReanimate(false)
      toggleAnimation()
    }
  }, [reanimate])

  return [toggleAnimation, isAnimating, tempPause]
}
