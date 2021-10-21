import * as React from "react"
import { GameContext } from "../gameContext"
import { About } from "./About"
import { Dialog } from "./Dialog"

export const AboutPrompt: React.FC = () => {
  const { pauseFirst } = React.useContext(GameContext)

  const [showPrompt, setShowPrompt] = React.useState(
    localStorage.getItem("promptShown") !== "true"
  )

  const [showAboutDialog, setShowAboutDialog] = React.useState(false)

  const hidePrompt = React.useCallback(() => {
    localStorage.setItem("promptShown", "true")
    setShowPrompt(false)
  }, [])

  const open = React.useCallback(() => {
    hidePrompt()
    pauseFirst(() => setShowAboutDialog(true))
  }, [hidePrompt, pauseFirst])

  return (
    <>
      <Dialog
        closeDialog={() => setShowAboutDialog(false)}
        showDialog={showAboutDialog}
      >
        <About />
      </Dialog>
      <div
        className={`about-button-wrapper ${showPrompt ? "show-prompt" : ""}`}
      >
        <button className="about-button" onClick={open}>
          About
        </button>
      </div>
      {showPrompt && (
        <div onClick={hidePrompt} className="prompt-background">
          <div className="prompt">
            I&apos;d recommend reading the first two sections of this before
            starting. <br />
            Tap anywhere to close
          </div>
        </div>
      )}
    </>
  )
}
