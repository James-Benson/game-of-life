import * as React from "react"
import { TGrid } from "../utils"

interface IUseDrawGridParams {
  canvasContext?: CanvasRenderingContext2D
  currentGridRef: React.MutableRefObject<TGrid>
  gridSize: number
  cellSize: number
}

export interface IDrawGridParams {
  gridSize?: number
  cellSize?: number
}

export function useDrawGrid(
  globalState: IUseDrawGridParams
): (newState?: IDrawGridParams) => void {
  const { canvasContext, currentGridRef } = globalState

  /** Draws passed grid (or currentGrid) onto canvas */
  const drawGrid = React.useCallback(
    (newState?: IDrawGridParams) => {
      // Can use global state, but can be passed new state if global state is not up to date
      const grid = currentGridRef.current
      const gridSize = newState?.gridSize ?? globalState.gridSize
      const cellSize = newState?.cellSize ?? globalState.cellSize

      if (canvasContext && grid?.[gridSize - 1]) {
        canvasContext.clearRect(0, 0, gridSize * cellSize, gridSize * cellSize)
        for (let x = 0; x < gridSize; x++) {
          for (let y = 0; y < gridSize; y++) {
            if (grid[x][y]) {
              canvasContext.fillRect(
                x * cellSize,
                y * cellSize,
                cellSize,
                cellSize
              )
            }
          }
        }
      }
    },
    [currentGridRef, globalState.gridSize, globalState.cellSize, canvasContext]
  )

  return drawGrid
}
