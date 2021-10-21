import * as React from "react"
import { GameContext } from "../gameContext"

/** Returns warning message if grid is too small for pattern, too big to fit on screen, or too big to fit on screen alongside controls */
export const SizeWarning: React.FC = () => {
  const {
    canvasRef,
    screenWidth,
    screenHeight,
    gridSizeInput,
    patternSize,
    predictedSize,
  } = React.useContext(GameContext)

  const controlsHeight = React.useMemo(
    () => canvasRef.current?.getBoundingClientRect().y,
    [canvasRef, screenHeight, screenWidth]
  )

  if (controlsHeight) {
    if (patternSize && gridSizeInput < patternSize) {
      return (
        <p>
          Resulting grid too small for pattern. <br />
          Recommended min grid size:
          <br />
          {patternSize}*{patternSize}&nbsp;cells
        </p>
      )
    }
    if (predictedSize > Math.min(screenWidth, screenHeight)) {
      return (
        <p>
          Resulting grid won&apos;t fit screen.
          <br />
          Recommended max grid size:
          <br />
          {screenWidth}*{screenHeight}&nbsp;pixels
        </p>
      )
    }
    if (predictedSize > Math.min(screenWidth, screenHeight - controlsHeight)) {
      return (
        <p>
          Controls & resulting grid won&apos;t fit screen.
          <br />
          Recommended max grid size:
          <br />
          {screenWidth}*{screenHeight - controlsHeight}&nbsp;pixels
        </p>
      )
    }
  }

  return null
}
