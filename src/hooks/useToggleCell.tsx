import * as React from "react"
import { GameContext } from "../gameContext"
import { cloneGrid } from "../utils"

/** Flip state of cell when clicking on it */
export function useToggleCell(): (
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
) => void {
  const { canvasRef, currentGridRef, cellSize, tempPause, drawGrid } =
    React.useContext(GameContext)

  const toggleCell = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect()
        const x = Math.floor((e.clientX - canvasRect.x) / cellSize)
        const y = Math.floor((e.clientY - canvasRect.y) / cellSize)
        tempPause()
        const newGrid = cloneGrid(currentGridRef.current)
        newGrid[x][y] = !currentGridRef.current[x][y]
        currentGridRef.current = newGrid
        drawGrid()
      }
    },
    [canvasRef, cellSize, tempPause, currentGridRef, drawGrid]
  )

  return toggleCell
}
