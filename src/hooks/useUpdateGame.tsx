import * as React from "react"
import { GameContext } from "../gameContext"

/** Updates current game with cell size & fps from inputs */
export function useUpdateGame(): () => void {
  const {
    cellSizeInput,
    fpsInput,
    cellSize,
    setCellSize,
    fps,
    setFps,
    tempPause,
    drawGrid,
  } = React.useContext(GameContext)

  const updateGame = React.useCallback(() => {
    tempPause()
    setCellSize(cellSizeInput)
    setFps(fpsInput)
  }, [cellSizeInput, setCellSize, fpsInput, setFps, tempPause])

  React.useEffect(() => {
    drawGrid()
  }, [cellSize, drawGrid, fps])

  return updateGame
}
