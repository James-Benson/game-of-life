import * as React from "react"

import { TDep } from "./useNewState"
import { TGrid } from "../utils"

/** Creates new game based on inputs */
export function useNewGame(
  patternInput: string,
  setPattern: (value: React.SetStateAction<string>) => void,
  customPatternInput: string,
  setCustomPattern: (value: React.SetStateAction<string>) => void,
  oddsInput: number,
  setOdds: (newState: number) => void,
  oddsDep: TDep<number>,
  gridSizeInput: number,
  setGridSize: (newState: number) => void,
  gridSizeDep: TDep<number>,
  cellSizeInput: number,
  setCellSize: (value: React.SetStateAction<number>) => void,
  fpsInput: number,
  setFps: (value: React.SetStateAction<number>) => void,
  isAnimating: boolean,
  toggleAnimation: () => void,
  createNewGrid: () => TGrid,
  setCurrentGrid: (value: React.SetStateAction<TGrid>) => void,
  drawGrid: (grid?: TGrid | undefined) => void
): () => void {
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

  React.useEffect(() => {
    if (isAnimating) {
      toggleAnimation()
    }
    const newGrid = createNewGrid()
    setCurrentGrid(newGrid)
    // Passing new grid to drawGrid, since new grid state set by setCurrentGrid() is not accessible yet
    drawGrid(newGrid)
    // Using dependencies from useNewState, to make a new grid even if the grid properties haven't changed
  }, [oddsDep, gridSizeDep])

  return newGame
}
