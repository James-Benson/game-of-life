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
    gridSizeInput,
    setGridSizeInput,
    currentGridRef,
  } = React.useContext(GameContext)

  const newGame = useNewGame()

  React.useEffect(() => {
    if (canvasRef.current && !gridSizeInput) {
      const controlsHeight = canvasRef.current.getBoundingClientRect().y
      const viewMin = Math.min(screenWidth, screenHeight - controlsHeight)
      setGridSizeInput(Math.floor(viewMin / cellSizeInput))
    }
  }, [canvasRef])

  React.useEffect(() => {
    if (!currentGridRef.current.length && gridSizeInput) {
      newGame()
    }
  }, [gridSizeInput])
}
