import * as React from "react"
import { GameContext } from "../gameContext"
import { useNewGame } from "./useNewGame"

/** Creates starting grid on app load */
export function useStartingGrid(): void {
  const {
    canvasRef,
    screenWidth,
    screenHeight,
    cellSizeInput,
    setGridSizeInput,
  } = React.useContext(GameContext)

  const newGame = useNewGame()

  // If newGame is called as early as possible, the canvas draw is not visible
  // Waiting for document to be ready fixes this
  const initialiseGrid = React.useCallback(() => {
    if (canvasRef.current && document.readyState === "complete") {
      const controlsHeight = canvasRef.current.getBoundingClientRect().y
      const viewMin = Math.min(screenWidth, screenHeight - controlsHeight)
      const newGridSize = Math.floor(viewMin / cellSizeInput)
      setGridSizeInput(newGridSize)
      newGame(newGridSize)
    }
  }, [
    canvasRef,
    screenWidth,
    screenHeight,
    cellSizeInput,
    setGridSizeInput,
    newGame,
  ])

  React.useEffect(() => {
    document.addEventListener("readystatechange", initialiseGrid)
    return () =>
      document.removeEventListener("readystatechange", initialiseGrid)
  }, [initialiseGrid])
}
