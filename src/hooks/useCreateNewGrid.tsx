import * as React from "react"
import { GameContext } from "../gameContext"
import { changeGridSize, decompressGrid, TGrid } from "../utils"

export function useCreateNewGrid(): () => TGrid {
  const { patternInput, customPatternInput, odds, gridSize } =
    React.useContext(GameContext)

  /** Returns randomly populated grid based on odds */
  const createRandomGrid = React.useCallback(() => {
    const grid: TGrid = []
    for (let x = 0; x < gridSize; x++) {
      grid[x] = []
      for (let y = 0; y < gridSize; y++) {
        grid[x][y] = Math.random() * 100 < odds
      }
    }
    return grid
  }, [gridSize, odds])

  /** Returns new grid, type dependant on selected pattern */
  const createNewGrid = React.useCallback(() => {
    switch (patternInput) {
      case "Random":
        return createRandomGrid()
      case "Load":
        return changeGridSize(decompressGrid(customPatternInput), gridSize)
      default:
        return changeGridSize(decompressGrid(patternInput), gridSize)
    }
  }, [patternInput, customPatternInput, createRandomGrid, gridSize])

  return createNewGrid
}
