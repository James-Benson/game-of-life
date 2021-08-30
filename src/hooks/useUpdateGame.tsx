import * as React from "react"

/** Updates current game with cell size & fps from inputs */
export function useUpdateGame(
  cellSize: number,
  setCellSize: (value: React.SetStateAction<number>) => void,
  cellSizeInput: number,
  fps: number,
  setFps: (value: React.SetStateAction<number>) => void,
  fpsInput: number,
  tempPause: () => void,
  drawGrid: () => void
): () => void {
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
