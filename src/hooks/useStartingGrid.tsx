import * as React from 'react'

import { TGrid } from '../utils'

/** Creates starting grid on app load */
export function useStartingGrid(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | undefined>,
  gridSizeInput: number,
  screenWidth: number,
  screenHeight: number,
  cellSizeInput: number,
  currentGrid: TGrid,
  newSim: () => void,
  setGridSizeInput: (value: React.SetStateAction<number>) => void
) {
  React.useEffect(() => {
    if (canvasRef.current && !gridSizeInput) {
      const controlsHeight = canvasRef.current.getBoundingClientRect().y
      const viewMin = Math.min(screenWidth, screenHeight - controlsHeight)
      setGridSizeInput(Math.floor(viewMin / cellSizeInput))
    }
  }, [canvasRef])

  React.useEffect(() => {
    if (!currentGrid.length && gridSizeInput) {
      newSim()
    }
  }, [gridSizeInput])
}