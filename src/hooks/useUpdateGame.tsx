import * as React from "react"
import { GameContext } from "../gameContext"

/** Updates current game with cell size & fps from inputs */
export function useUpdateGame(): () => void {
  const {
    cellSizeInput,
    gridSizeInput,
    fpsInput,
    setCellSize,
    setFps,
    tempPause,
    drawGrid,
  } = React.useContext(GameContext)

  const updateGame = React.useCallback(() => {
    tempPause()
    setCellSize(cellSizeInput)
    setFps(fpsInput)
    drawGrid({ cellSize: cellSizeInput, gridSize: gridSizeInput })
  }, [
    tempPause,
    setCellSize,
    cellSizeInput,
    setFps,
    fpsInput,
    drawGrid,
    gridSizeInput,
  ])

  return updateGame
}
