import * as React from "react"
import { TGrid } from "../utils"

export function useUpdateGrid(params: {
  currentGridRef: React.MutableRefObject<TGrid>
}): () => void {
  const { currentGridRef } = params

  /**
   * Creates new grid based on currentGrid state
   * New grid is set as currentGrid
   */
  const updateGrid = React.useCallback(() => {
    const grid = currentGridRef.current
    const gridSize = grid.length
    const newGrid: TGrid = []
    for (let x = 0; x < gridSize; x++) {
      newGrid[x] = []
      for (let y = 0; y < gridSize; y++) {
        // Count number of live neighbours
        let sum = 0
        for (let i = x - 1; i <= x + 1; i++) {
          for (let j = y - 1; j <= y + 1; j++) {
            if (
              (i !== x || j !== y) && // Ignore cell's own value
              grid[i]?.[j] // Check neighbour is live, and not outside grid
            ) {
              sum++
            }
          }
        }
        // If cell is live & has 2 live neighbours, or cell has 3 live neighbours, make cell live next cycle
        newGrid[x][y] = (grid[x][y] && sum === 2) || sum === 3
      }
    }
    currentGridRef.current = newGrid
  }, [currentGridRef])

  return updateGrid
}
