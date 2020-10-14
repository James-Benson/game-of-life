import * as React from 'react';

/** Allows pixel size of grid to be locked, by keeping the product of cellSize & gridSize constant */
export function useLockGridSize(
  gridSizeInput: number,
  setGridSizeInput: (state: number) => void,
  cellSizeInput: number,
  setCellSizeInput: (state: number) => void)
  : [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [lockGridSize, setLockGridSize] = React.useState(false)
  const [oldGridSize, setOldGridSize] = React.useState(gridSizeInput)
  const [oldCellSize, setOldCellSize] = React.useState(cellSizeInput)

  const oldSize = React.useMemo(() => oldGridSize * oldCellSize, [oldGridSize, oldCellSize])

  const limitReached = React.useCallback((value: number) => {
    if (value < 1) {
      setGridSizeInput(oldGridSize)
      setCellSizeInput(oldCellSize)
      throw Error('Cannot lower this value further')
    }
  }, [setGridSizeInput, oldGridSize, setCellSizeInput, oldCellSize])

  const handleChange = React.useCallback((changededValue: number, affectedValue: number, change: 'increase' | 'decrease'): [number, number] => {
    changededValue += (change === 'increase' ? -1 : 1)
    do {
      changededValue += (change === 'increase' ? 1 : -1)
      affectedValue = oldSize / changededValue
      limitReached(change === 'increase' ? affectedValue : changededValue)
    } while (!Number.isInteger(affectedValue))
    return [changededValue, affectedValue]
  }, [oldSize, limitReached])

  React.useEffect(() => {
    if (lockGridSize) {
      try {
        let newGridSize = gridSizeInput
        let newCellSize = cellSizeInput

        if (gridSizeInput > oldGridSize) {
          [newGridSize, newCellSize] = handleChange(newGridSize, newCellSize, 'increase')
        } else if (gridSizeInput < oldGridSize) {
          [newGridSize, newCellSize] = handleChange(newGridSize, newCellSize, 'decrease')
        } else if (cellSizeInput > oldCellSize) {
          [newCellSize, newGridSize] = handleChange(newCellSize, newGridSize, 'increase')
        } else if (cellSizeInput < oldCellSize) {
          [newCellSize, newGridSize] = handleChange(newCellSize, newGridSize, 'decrease')
        }
        setGridSizeInput(newGridSize)
        setCellSizeInput(newCellSize)
        setOldGridSize(newGridSize)
        setOldCellSize(newCellSize)
      } catch (e) {
        if (e.message !== 'Cannot lower this value further') throw e
      }
    } else {
      setOldGridSize(gridSizeInput)
      setOldCellSize(cellSizeInput)
    }
  }, [lockGridSize, gridSizeInput, cellSizeInput])

  return [lockGridSize, setLockGridSize]
}