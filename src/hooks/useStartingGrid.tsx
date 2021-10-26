import * as React from "react"
import { GameContext } from "../gameContext"
import { useNewGame } from "./useNewGame"

/** Creates starting grid on app load */
export function useStartingGrid(): void {
  const {
    canvasRef,
    canvasContext,
    screenWidth,
    screenHeight,
    cellSizeInput,
    setGridSizeInput,
  } = React.useContext(GameContext)

  const newGame = useNewGame()

  React.useEffect(() => {
    if (canvasRef.current && canvasContext) {
      const controlsHeight = canvasRef.current.getBoundingClientRect().y
      const viewMin = Math.min(screenWidth, screenHeight - controlsHeight)
      const newGridSize = Math.floor(viewMin / cellSizeInput)
      setGridSizeInput(newGridSize)
      newGame(newGridSize)
    }
  }, [canvasRef.current, canvasContext])
}
