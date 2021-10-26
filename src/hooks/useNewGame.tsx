import * as React from "react"

import { GameContext } from "../gameContext"
import { createNewGrid } from "../utils"

/** Creates new game based on inputs */
export function useNewGame(): (newGridSize?: number) => void {
  const {
    oddsInput,
    cellSizeInput,
    gridSizeInput,
    fpsInput,
    patternInput,
    customPatternInput,
    currentGridRef,
    setOdds,
    setGridSize,
    setCellSize,
    setFps,
    setPattern,
    setCustomPattern,
    toggleAnimation,
    isAnimating,
    drawGrid,
  } = React.useContext(GameContext)

  const newGame = React.useCallback(
    (newGridSize?: number) => {
      setPattern(patternInput)
      setCustomPattern(customPatternInput)
      setOdds(oddsInput)
      setGridSize(newGridSize ?? gridSizeInput)
      setCellSize(cellSizeInput)
      setFps(fpsInput)

      if (isAnimating) {
        toggleAnimation()
      }

      currentGridRef.current = createNewGrid({
        customPattern: customPatternInput,
        gridSize: newGridSize ?? gridSizeInput,
        odds: oddsInput,
        pattern: patternInput,
      })

      drawGrid({
        cellSize: cellSizeInput,
        gridSize: newGridSize ?? gridSizeInput,
      })
    },
    [
      setPattern,
      patternInput,
      setCustomPattern,
      customPatternInput,
      setOdds,
      oddsInput,
      setGridSize,
      gridSizeInput,
      setCellSize,
      cellSizeInput,
      setFps,
      fpsInput,
      isAnimating,
      currentGridRef,
      drawGrid,
      toggleAnimation,
    ]
  )

  return newGame
}
