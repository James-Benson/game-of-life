import * as React from "react"
import { GameContext } from "../gameContext"
import { cloneGrid } from "../utils"

/** Flip state of cell when clicking on it */
export function useToggleCell(): (
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
) => void {
  const {
    canvasRef,
    currentGrid,
    setCurrentGrid,
    cellSize,
    tempPause,
    drawGrid,
  } = React.useContext(GameContext)

  const toggleCell = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (canvasRef.current && currentGrid) {
        const canvasRect = canvasRef.current.getBoundingClientRect()
        const x = Math.floor((e.clientX - canvasRect.x) / cellSize)
        const y = Math.floor((e.clientY - canvasRect.y) / cellSize)
        tempPause()
        const newGrid = cloneGrid(currentGrid)
        newGrid[x][y] = !currentGrid[x][y]
        setCurrentGrid(newGrid)
        drawGrid(newGrid)
      }
    },
    [cellSize, canvasRef, currentGrid, setCurrentGrid, drawGrid, tempPause]
  )

  return toggleCell
}
