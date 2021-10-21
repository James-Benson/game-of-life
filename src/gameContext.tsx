import * as React from "react"
import { useAnimationFrame } from "./hooks/useAnimationFrame"
import { useDrawGrid } from "./hooks/useDrawGrid"
import { TControl, useInputControl } from "./hooks/useInputControl"
import { TDep, useNewState } from "./hooks/useNewState"
import { useUpdateGrid } from "./hooks/useUpdateGrid"
import { useWindowSize } from "./hooks/useWindowSize"
import { TGrid } from "./utils"

interface IGameContextValue {
  // Canvas properties
  canvasRef: React.MutableRefObject<HTMLCanvasElement | undefined>
  canvasContext?: CanvasRenderingContext2D
  setCanvasContext: React.Dispatch<
    React.SetStateAction<CanvasRenderingContext2D | undefined>
  >

  // State for checking size of grid relative to size of screen
  screenWidth: number
  screenHeight: number

  // Controls, states, & setStates for grid properties
  oddsInputControl: TControl<number>
  oddsInput: number
  cellSizeInputControl: TControl<number>
  cellSizeInput: number
  setCellSizeInput: React.Dispatch<React.SetStateAction<number>>
  gridSizeInputControl: TControl<number>
  gridSizeInput: number
  setGridSizeInput: React.Dispatch<React.SetStateAction<number>>
  fpsInputControl: TControl<number>
  fpsInput: number
  patternInputControl: TControl<string>
  patternInput: string
  customPatternInputControl: TControl<string>
  customPatternInput: string

  // Grid properties
  currentGrid: TGrid
  setCurrentGrid: React.Dispatch<React.SetStateAction<TGrid>>
  odds: number
  oddsDep: TDep<number>
  setOdds: (newState: number) => void
  gridSize: number
  gridSizeDep: TDep<number>
  setGridSize: (newState: number) => void
  cellSize: number
  setCellSize: React.Dispatch<React.SetStateAction<number>>
  fps: number
  setFps: React.Dispatch<React.SetStateAction<number>>
  pattern: string
  setPattern: React.Dispatch<React.SetStateAction<string>>
  customPattern: string
  setCustomPattern: React.Dispatch<React.SetStateAction<string>>
  patternSize?: number

  // State for checking grid will be smaller than screen
  predictedSize: number

  // Handles playing & pausing of game
  toggleAnimation: () => void
  isAnimating: boolean
  tempPause: () => void
  pauseFirst: (callback: () => void) => void

  // Grid functions
  drawGrid: (grid?: TGrid) => void
  updateGrid: (grid?: TGrid) => TGrid
}

export const GameContext = React.createContext<IGameContextValue>(
  {} as IGameContextValue
)

export const GameContextProvider: React.FC = ({ children }) => {
  // Canvas properties
  const canvasRef = React.useRef<HTMLCanvasElement>()
  const [canvasContext, setCanvasContext] =
    React.useState<CanvasRenderingContext2D>()

  // State for checking size of grid relative to size of screen
  const { screenWidth, screenHeight } = useWindowSize(200)

  // Controls, states, & setStates for grid properties
  const [oddsInputControl, oddsInput] = useInputControl(50)
  const [cellSizeInputControl, cellSizeInput, setCellSizeInput] =
    useInputControl(10)
  const [gridSizeInputControl, gridSizeInput, setGridSizeInput] =
    useInputControl(0)
  const [fpsInputControl, fpsInput] = useInputControl(30)
  const [patternInputControl, patternInput] = useInputControl("Random")
  const [customPatternInputControl, customPatternInput] = useInputControl("")

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

  // State for checking grid will be smaller than screen
  const predictedSize = React.useMemo(
    () => gridSizeInput * cellSizeInput,
    [gridSizeInput, cellSizeInput]
  )

  const drawGrid = useDrawGrid({
    cellSize,
    currentGrid,
    gridSize,
    canvasContext,
  })
  const updateGrid = useUpdateGrid({ currentGrid, gridSize, setCurrentGrid })

  // Handles playing & pausing of game
  const [toggleAnimation, isAnimating, tempPause] = useAnimationFrame<TGrid>(
    fps,
    prevGrid => {
      const newGrid = updateGrid(prevGrid)
      drawGrid(newGrid)
      return newGrid
    }
  )
  /** Pauses game, then runs a given function */
  const pauseFirst = React.useCallback(
    (callback: () => void) => {
      if (isAnimating) {
        toggleAnimation()
      }
      callback()
    },
    [isAnimating, toggleAnimation]
  )

  const gameContextValue = {
    // Canvas properties
    canvasRef,
    canvasContext,
    setCanvasContext,

    // State for checking size of grid relative to size of screen
    screenWidth,
    screenHeight,

    // Controls, states, & setStates for grid properties
    oddsInputControl,
    oddsInput,
    cellSizeInputControl,
    cellSizeInput,
    setCellSizeInput,
    gridSizeInputControl,
    gridSizeInput,
    setGridSizeInput,
    fpsInputControl,
    fpsInput,
    patternInputControl,
    patternInput,
    customPatternInputControl,
    customPatternInput,

    // Grid properties
    currentGrid,
    setCurrentGrid,
    odds,
    oddsDep,
    setOdds,
    gridSize,
    gridSizeDep,
    setGridSize,
    cellSize,
    setCellSize,
    fps,
    setFps,
    pattern,
    setPattern,
    customPattern,
    setCustomPattern,
    patternSize,

    // State for checking grid will be smaller than screen
    predictedSize,

    // Handles playing & pausing of game
    toggleAnimation,
    isAnimating,
    tempPause,
    pauseFirst,

    // Grid functions
    drawGrid,
    updateGrid,
  }

  return (
    <GameContext.Provider value={gameContextValue}>
      {children}
    </GameContext.Provider>
  )
}
