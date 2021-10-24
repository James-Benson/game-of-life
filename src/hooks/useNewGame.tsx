import * as React from "react"

import { GameContext } from "../gameContext"
import { useCreateNewGrid } from "./useCreateNewGrid"

/** Creates new game based on inputs */
export function useNewGame(): () => void {
  const {
    oddsInput,
    cellSizeInput,
    gridSizeInput,
    fpsInput,
    patternInput,
    customPatternInput,
    currentGridRef,
    oddsDep,
    setOdds,
    gridSizeDep,
    setGridSize,
    setCellSize,
    setFps,
    setPattern,
    setCustomPattern,
    toggleAnimation,
    isAnimating,
    drawGrid,
  } = React.useContext(GameContext)

  const newGame = React.useCallback(() => {
    setPattern(patternInput)
    setCustomPattern(customPatternInput)
    setOdds(oddsInput)
    setGridSize(gridSizeInput)
    setCellSize(cellSizeInput)
    setFps(fpsInput)
  }, [
    patternInput,
    customPatternInput,
    oddsInput,
    gridSizeInput,
    cellSizeInput,
    fpsInput,
    setOdds,
    setGridSize,
    setCellSize,
    setCustomPattern,
    setFps,
    setPattern,
  ])

  const createNewGrid = useCreateNewGrid()

  // Currently works by the fact that oddsDep & gridSizeDep only change when a new game is created (by user interaction, or when the site loads)
  React.useEffect(() => {
    if (isAnimating) {
      toggleAnimation()
    }
    const newGrid = createNewGrid()
    currentGridRef.current = newGrid
    drawGrid()
    // Using dependencies from useNewState, to make a new grid even if the grid properties haven't changed
  }, [oddsDep, gridSizeDep])

  return newGame
}
