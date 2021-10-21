import * as React from "react"

import { PatternSelector } from "./components/PatternSelector"
import { useStartingGrid } from "./hooks/useStartingGrid"
import { useUpdateGame } from "./hooks/useUpdateGame"
import { useNewGame } from "./hooks/useNewGame"
import { Marker } from "./components/Marker"
import { AboutPrompt } from "./components/AboutPrompt"
import { SizeSelector } from "./components/SizeSelector"
import { GameContext } from "./gameContext"
import { useToggleCell } from "./hooks/useToggleCell"
import { SizeWarning } from "./components/SizeWarning"
import { About } from "./components/About"
import { Dialog } from "./components/Dialog"
import { SavedGrid } from "./components/SavedGrid"
import { patternList } from "./utils"

function App(): JSX.Element {
  const {
    canvasRef,
    setCanvasContext,
    fpsInputControl,
    fpsInput,
    patternInput,
    gridSize,
    cellSize,
    fps,
    predictedSize,
    toggleAnimation,
    isAnimating,
  } = React.useContext(GameContext)

  // Canvas properties
  const createCanvasContext = React.useCallback(
    (node: HTMLCanvasElement) => {
      canvasRef.current = node
      setCanvasContext(node?.getContext("2d") || undefined)
    },
    [canvasRef, setCanvasContext]
  )

  /** Creates new game based on inputs */
  const newGame = useNewGame()

  /** Updates current game with cell size & fps from inputs */
  const updateGame = useUpdateGame()

  // Create starting grid on app load
  useStartingGrid()

  /** Flip state of cell when clicking on it */
  const toggleCell = useToggleCell()

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

  // Dialog controls
  const [showAboutDialog, setShowAboutDialog] = React.useState(false)
  const [showSavedGridDialog, setShowSavedGridDialog] = React.useState(false)
  const [showCategoryDescriptionDialog, setShowCategoryDescriptionDialog] =
    React.useState(false)

  const categoryDescription = React.useMemo(
    () =>
      patternList.filter(category =>
        Object.values(category.patterns).includes(patternInput)
      )[0]?.description,
    [patternInput]
  )

  return (
    <>
      <Dialog
        closeDialog={() => setShowAboutDialog(false)}
        showDialog={showAboutDialog}
      >
        <About />
      </Dialog>
      <Dialog
        closeDialog={() => setShowSavedGridDialog(false)}
        showDialog={showSavedGridDialog}
      >
        <SavedGrid />
      </Dialog>
      <Dialog
        closeDialog={() => setShowCategoryDescriptionDialog(false)}
        showDialog={showCategoryDescriptionDialog}
      >
        {categoryDescription}
      </Dialog>

      <div className="container">
        <AboutPrompt
          openAboutDialog={() => pauseFirst(() => setShowAboutDialog(true))}
        />
        <div className="flex-container">
          <div className="flex-col">
            <div className="control-container">
              <PatternSelector
                openPatternInfoDialog={() =>
                  pauseFirst(() => setShowCategoryDescriptionDialog(true))
                }
              />
            </div>

            <div className="control-container">
              <SizeSelector />
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
            <SizeWarning />
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
          <button
            onClick={() => pauseFirst(() => setShowSavedGridDialog(true))}
          >
            Save
          </button>
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
