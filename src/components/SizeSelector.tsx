import * as React from "react"
import { GameContext } from "../gameContext"

import { useInputControl } from "../hooks/useInputControl"
import { Marker } from "./Marker"

export const SizeSelector: React.FC = () => {
  const {
    cellSizeInputControl,
    cellSizeInput,
    setCellSizeInput,
    gridSizeInputControl,
    gridSizeInput,
    setGridSizeInput,
    gridSize,
    cellSize,
  } = React.useContext(GameContext)

  const [lockGridSizeInputControl, gridLockSizeInput] = useInputControl(false)
  const [gridPixelSize, setGridPixelSize] = React.useState(
    gridSizeInput * cellSizeInput
  )

  const gridPixelSizeFactors = React.useMemo(() => {
    if (gridLockSizeInput) {
      const factors: number[] = [1]
      for (let factor = 2; factor <= gridPixelSize / 2; factor++) {
        if (Number.isInteger(gridPixelSize / factor)) {
          factors.unshift(factor)
        }
      }
      factors.unshift(gridPixelSize)
      return factors
    }
  }, [gridLockSizeInput, gridPixelSize])

  // When gridSizeInput or cellSizeInput change, change the other such that their product is the original grid size in pixels
  React.useEffect(() => {
    if (gridLockSizeInput) {
      const newCellSize = gridPixelSize / gridSizeInput
      setCellSizeInput(newCellSize)
      setGridPixelSize(newCellSize * gridSizeInput)
    } else {
      setGridPixelSize(gridSizeInput * cellSizeInput)
    }
  }, [gridSizeInput])
  React.useEffect(() => {
    if (gridLockSizeInput) {
      const newGridSize = gridPixelSize / cellSizeInput
      setGridSizeInput(newGridSize)
      setGridPixelSize(newGridSize * cellSizeInput)
    } else {
      setGridPixelSize(gridSizeInput * cellSizeInput)
    }
  }, [cellSizeInput])

  return (
    <>
      <label htmlFor="gridSize">Width/height of grid in cells</label>
      {gridLockSizeInput ? (
        <select id="gridSize" {...gridSizeInputControl}>
          {gridPixelSizeFactors?.map(factor => (
            <option key={`grid${factor}`} value={factor}>
              {factor}
            </option>
          ))}
        </select>
      ) : (
        <input type="number" id="gridSize" {...gridSizeInputControl} />
      )}
      <Marker show={gridSizeInput !== gridSize} symbol="*" />

      <label htmlFor="cellSize">Width/height of cells in pixels</label>
      {gridLockSizeInput ? (
        <select id="cellSize" {...cellSizeInputControl}>
          {gridPixelSizeFactors?.map(factor => (
            <option key={`cell${factor}`} value={factor}>
              {factor}
            </option>
          ))}
        </select>
      ) : (
        <input type="number" id="cellSize" {...cellSizeInputControl} />
      )}
      <Marker show={cellSizeInput !== cellSize} symbol="†" />

      <label htmlFor="lockGridSize">Lock resulting grid size</label>
      <input type="checkbox" id="lockGridSize" {...lockGridSizeInputControl} />
    </>
  )
}
