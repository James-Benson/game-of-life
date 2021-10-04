import * as React from "react"

import { useAnimationFrame } from "./hooks/useAnimationFrame"
import { useNewState } from "./hooks/useNewState"
import { useInputControl } from "./hooks/useInputControl"
import { useWindowSize } from "./hooks/useWindowSize"
import { useDialog } from "./hooks/useDialog"
import { PatternSelector } from "./components/PatternSelector"
import {
  changeGridSize,
  cloneGrid,
  compressGrid,
  decompressGrid,
  patternList,
  TGrid,
} from "./utils"
import { useStartingGrid } from "./hooks/useStartingGrid"
import { useUpdateGame } from "./hooks/useUpdateGame"
import { useNewGame } from "./hooks/useNewGame"
import { useCopyElementText } from "./hooks/useCopyElementText"
import { Marker } from "./components/Marker"
import { AboutPrompt } from "./components/AboutPrompt"
import { About } from "./components/About"
import { SizeSelector } from "./components/SizeSelector"

function App(): JSX.Element {
  // Canvas properties
  const canvasRef = React.useRef<HTMLCanvasElement>()
  const [canvasContext, setCanvasContext] =
    React.useState<CanvasRenderingContext2D>()
  const createCanvasContext = React.useCallback((node: HTMLCanvasElement) => {
    canvasRef.current = node
    setCanvasContext(node?.getContext("2d") || undefined)
  }, [])

  // State for checking size of grid relative to size of screen
  const { screenWidth, screenHeight } = useWindowSize(200)

  // Grid property input states
  const [oddsInputControl, oddsInput] = useInputControl<number>(50)
  const [cellSizeInputControl, cellSizeInput, setCellSizeInput] =
    useInputControl<number>(10)
  const [gridSizeInputControl, gridSizeInput, setGridSizeInput] =
    useInputControl<number>(0)
  const [fpsInputControl, fpsInput] = useInputControl<number>(30)
  const [patternInputControl, patternInput] = useInputControl<string>("Random")
  const [customPatternInputControl, customPatternInput] =
    useInputControl<string>("")

  // State for checking grid will be smaller than screen
  const predictedSize = React.useMemo(
    () => gridSizeInput * cellSizeInput,
    [gridSizeInput, cellSizeInput]
  )

  // Grid properties
  const [currentGrid, setCurrentGrid] = React.useState<TGrid>([[]])
  const [odds, oddsDep, setOdds] = useNewState(0)
  const [gridSize, gridSizeDep, setGridSize] = useNewState(0)
  const [cellSize, setCellSize] = React.useState(0)
  const [fps, setFps] = React.useState(0)
  const [pattern, setPattern] = React.useState("Random")
  const [customPattern, setCustomPattern] = React.useState("")
  const patternSize = React.useMemo(() => {
    switch (patternInput) {
      case "Random":
        return undefined
      case "Load":
        return parseInt(customPatternInput)
      default:
        return parseInt(patternInput)
    }
  }, [patternInput, customPatternInput])

  // Handles playing & pausing of game
  const [toggleAnimation, isAnimating, tempPause] = useAnimationFrame<TGrid>(
    fps,
    prevGrid => {
      const newGrid = updateGrid(prevGrid)
      drawGrid(newGrid)
      return newGrid
    }
  )

  // Dialog stuff
  const [Dialog, openDialog] = useDialog()
  // Opens dialog containing information about the app
  const openAboutDialog = React.useCallback(() => {
    if (isAnimating) {
      toggleAnimation()
    }
    openDialog(<About />)
  }, [openDialog, isAnimating, toggleAnimation])
  // Opens dialog containing compressed grid string
  const [savedGridElementRef, copySavedGrid] =
    useCopyElementText<HTMLParagraphElement>()
  const openSaveGridDialog = React.useCallback(() => {
    if (isAnimating) {
      toggleAnimation()
    }
    openDialog(
      <>
        <p>
          Copy the below text, select &apos;Load Saved Grid&apos; in the pattern
          dropdown, & paste into the input
        </p>
        <button onClick={copySavedGrid}>Copy pattern</button>
        <input type="text" hidden defaultValue={compressGrid(currentGrid)} />
        <p ref={savedGridElementRef}>{compressGrid(currentGrid)}</p>
      </>
    )
  }, [
    openDialog,
    isAnimating,
    toggleAnimation,
    currentGrid,
    copySavedGrid,
    savedGridElementRef,
  ])
  // Opens dialog describing pattern category
  const openPatternInfoDialog = React.useCallback(() => {
    if (isAnimating) {
      toggleAnimation()
    }
    openDialog(
      <>
        {
          patternList.filter(category =>
            Object.values(category.patterns).includes(patternInput)
          )[0]?.description
        }
      </>
    )
  }, [openDialog, isAnimating, toggleAnimation, patternInput])

  /** Returns randomly populated grid based on odds */
  const createRandomGrid = React.useCallback(() => {
    const grid: TGrid = []
    for (let x = 0; x < gridSize; x++) {
      grid[x] = []
      for (let y = 0; y < gridSize; y++) {
        grid[x][y] = Math.random() * 100 < odds
      }
    }
    return grid
  }, [gridSize, odds])

  /** Returns new grid, type dependant on selected pattern */
  const createNewGrid = React.useCallback(() => {
    switch (patternInput) {
      case "Random":
        return createRandomGrid()
      case "Load":
        return changeGridSize(decompressGrid(customPatternInput), gridSize)
      default:
        return changeGridSize(decompressGrid(patternInput), gridSize)
    }
  }, [patternInput, customPatternInput, createRandomGrid, gridSize])

  /**
   * Creates new grid based on passed grid (or currentGrid state)
   * New grid is set as currentGrid, & returned
   */
  const updateGrid = React.useCallback(
    (grid?: TGrid) => {
      // Can use grid state, but can be passed a grid if grid state is not up to date
      grid = grid ?? currentGrid
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
              )
                sum++
            }
          }
          // If cell is live & has 2 live neighbours, or cell has 3 live neighbours, make cell live next cycle
          newGrid[x][y] = (grid[x][y] && sum === 2) || sum === 3
        }
      }
      setCurrentGrid(newGrid)
      return newGrid
    },
    [currentGrid, gridSize]
  )

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

  /** Creates new game based on inputs */
  const newGame = useNewGame(
    patternInput,
    setPattern,
    customPatternInput,
    setCustomPattern,
    oddsInput,
    setOdds,
    oddsDep,
    gridSizeInput,
    setGridSize,
    gridSizeDep,
    cellSizeInput,
    setCellSize,
    fpsInput,
    setFps,
    isAnimating,
    toggleAnimation,
    createNewGrid,
    setCurrentGrid,
    drawGrid
  )

  /** Updates current game with cell size & fps from inputs */
  const updateGame = useUpdateGame(
    cellSize,
    setCellSize,
    cellSizeInput,
    fps,
    setFps,
    fpsInput,
    tempPause,
    drawGrid
  )

  // Create starting grid on app load
  useStartingGrid(
    canvasRef,
    gridSizeInput,
    screenWidth,
    screenHeight,
    cellSizeInput,
    currentGrid,
    newGame,
    setGridSizeInput
  )

  /** Flip state of cell when clicking on it */
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
    [cellSize, canvasRef, currentGrid, drawGrid, tempPause]
  )

  /** Returns warning message if grid is too small for pattern, too big to fit on screen, or too big to fit on screen alongside controls */
  const sizeWarning = React.useMemo(() => {
    if (canvasRef.current) {
      const controlsHeight = canvasRef.current.getBoundingClientRect().y

      if (patternSize && gridSizeInput < patternSize) {
        return (
          <p>
            Resulting grid too small for pattern. <br />
            Recommended min grid size:
            <br />
            {patternSize}*{patternSize}&nbsp;cells
          </p>
        )
      } else if (predictedSize > Math.min(screenWidth, screenHeight)) {
        return (
          <p>
            Resulting grid won&apos;t fit screen.
            <br />
            Recommended max grid size:
            <br />
            {screenWidth}*{screenHeight}&nbsp;pixels
          </p>
        )
      } else if (
        predictedSize > Math.min(screenWidth, screenHeight - controlsHeight)
      ) {
        return (
          <p>
            Controls & resulting grid won&apos;t fit screen.
            <br />
            Recommended max grid size:
            <br />
            {screenWidth}*{screenHeight - controlsHeight}&nbsp;pixels
          </p>
        )
      }
    }
  }, [
    canvasRef,
    screenWidth,
    screenHeight,
    predictedSize,
    gridSizeInput,
    patternSize,
  ])

  return (
    <>
      <Dialog />
      <div className="container">
        <AboutPrompt {...{ openAboutDialog }} />
        <div className="flex-container">
          <div className="flex-col">
            <div className="control-container">
              <PatternSelector
                {...{
                  pattern,
                  patternInput,
                  patternInputControl,
                  customPattern,
                  customPatternInput,
                  customPatternInputControl,
                  odds,
                  oddsInput,
                  oddsInputControl,
                  openPatternInfoDialog,
                }}
              />
            </div>

            <div className="control-container">
              <SizeSelector
                {...{
                  gridSize,
                  gridSizeInput,
                  gridSizeInputControl,
                  setGridSizeInput,
                  cellSize,
                  cellSizeInput,
                  cellSizeInputControl,
                  setCellSizeInput,
                }}
              />
            </div>

            <div className="control-container">
              <label htmlFor="fps">Cycles per second</label>
              <input type="number" id="fps" {...fpsInputControl} />
              <Marker show={fpsInput !== fps} symbol="†" />
            </div>
          </div>

          <div className="flex-col">
            <p>
              <strong>*</strong>Start new game to apply
            </p>
            <p>
              <strong>†</strong>Update/start new game to apply
            </p>
            <p>
              Resulting grid size:
              <br />
              {predictedSize}*{predictedSize}&nbsp;pixels
            </p>
            {sizeWarning}
          </div>
        </div>

        <div className="buttons-container">
          <button
            className="play-pause-button"
            onClick={() => toggleAnimation()}
          >
            {isAnimating ? "⏸️ Pause" : "▶️ Play"}
          </button>
          <button onClick={updateGame}>Update</button>
          <button onClick={newGame}>New game</button>
          <button onClick={openSaveGridDialog}>Save</button>
        </div>

        <canvas
          ref={createCanvasContext}
          onClick={e => toggleCell(e)}
          width={gridSize * cellSize}
          height={gridSize * cellSize}
        />
      </div>
    </>
  )
}

export default App
