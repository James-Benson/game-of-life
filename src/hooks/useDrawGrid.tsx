import * as React from "react"
import { TGrid } from "../utils"

export function useDrawGrid(params: {
  canvasContext?: CanvasRenderingContext2D
  currentGrid: TGrid
  gridSize: number
  cellSize: number
}): (grid?: TGrid) => void {
  const { canvasContext, currentGrid, gridSize, cellSize } = params

  /** Draws passed grid (or currentGrid) onto canvas */
  const drawGrid = React.useCallback(
    (grid?: TGrid) => {
      // Can use grid state, but can be passed a grid if grid state is not up to date
      grid = grid ?? currentGrid
      if (canvasContext && grid?.[gridSize - 1]) {
        canvasContext.clearRect(0, 0, gridSize * cellSize, gridSize * cellSize)
        for (let x = 0; x < gridSize; x++) {
          for (let y = 0; y < gridSize; y++) {
            grid[x][y] &&
              canvasContext.fillRect(
                x * cellSize,
                y * cellSize,
                cellSize,
                cellSize
              )
          }
        }
      }
    },
    [canvasContext, gridSize, cellSize, currentGrid]
  )

  return drawGrid
}
