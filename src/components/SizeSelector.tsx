import * as React from 'react';

import { useInputControl } from '../hooks/useInputControl';
import { Marker } from './Marker';

interface ISizeSelectorProps {
  gridSize: number
  gridSizeInput: number
  setGridSizeInput: React.Dispatch<React.SetStateAction<number>>
  cellSize: number
  cellSizeInput: number
  setCellSizeInput: React.Dispatch<React.SetStateAction<number>>
}

export const SizeSelector: React.FC<ISizeSelectorProps> = props => {
  const [gridLockSizeInput, setLockGridSizeInput] = React.useState(false)
  const [gridPixelSize, setGridPixelSize] = React.useState(props.gridSizeInput * props.cellSizeInput)

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

  // When gridSizeInput or cellSizeInput change, change the othe such that their product is the original grid size in pixels
  React.useEffect(() => {
    if (gridLockSizeInput) {
      const newCellSize = gridPixelSize / props.gridSizeInput
      props.setCellSizeInput(newCellSize)
      setGridPixelSize(newCellSize * props.gridSizeInput)
    } else {
      setGridPixelSize(props.gridSizeInput * props.cellSizeInput)
    }
  }, [props.gridSizeInput])
  React.useEffect(() => {
    if (gridLockSizeInput) {
      const newGridSize = gridPixelSize / props.cellSizeInput
      props.setGridSizeInput(newGridSize)
      setGridPixelSize(newGridSize * props.cellSizeInput)
    } else {
      setGridPixelSize(props.gridSizeInput * props.cellSizeInput)
    }
  }, [props.cellSizeInput])

  const gridSizeControl = useInputControl(props.gridSizeInput, props.setGridSizeInput)
  const cellSizeControl = useInputControl(props.cellSizeInput, props.setCellSizeInput)
  const lockGridSizeControl = useInputControl(gridLockSizeInput, setLockGridSizeInput)

  return (
    <>
      <label htmlFor='gridSize'>Width/height of grid in cells</label>
      {gridLockSizeInput ?
        <select id='gridSize' {...gridSizeControl}>
          {gridPixelSizeFactors?.map(factor => <option key={'grid' + factor} value={factor}>{factor}</option>)}
        </select>
        :
        <input type='number' id='gridSize' {...gridSizeControl} />
      }
      <Marker show={props.gridSizeInput !== props.gridSize} symbol='*' />

      <label htmlFor='cellSize'>Width/height of cells in pixels</label>
      {gridLockSizeInput ?
        <select id='cellSize' {...cellSizeControl}>
          {gridPixelSizeFactors?.map(factor => <option key={'cell' + factor} value={factor}>{factor}</option>)}
        </select>
        :
        <input type='number' id='cellSize' {...cellSizeControl} />
      }
      <Marker show={props.cellSizeInput !== props.cellSize} symbol='†' />

      <label htmlFor='lockGridSize'>Lock resulting grid size</label>
      <input type='checkbox' id='lockGridSize' {...lockGridSizeControl} />
    </>
  )
}