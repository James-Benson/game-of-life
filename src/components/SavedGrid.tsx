import * as React from "react"
import { GameContext } from "../gameContext"
import { useCopyElementText } from "../hooks/useCopyElementText"
import { compressGrid } from "../utils"

export const SavedGrid: React.FC = () => {
  const { currentGridRef } = React.useContext(GameContext)

  const [savedGridElementRef, copySavedGrid] =
    useCopyElementText<HTMLParagraphElement>()

  const compressedGrid = React.useMemo(
    () => compressGrid(currentGridRef.current),
    []
  )

  return (
    <>
      <p>
        Copy the below text, select &apos;Load Saved Grid&apos; in the pattern
        dropdown, & paste into the input
      </p>
      <button onClick={copySavedGrid}>Copy pattern</button>
      <input type="text" hidden defaultValue={compressedGrid} />
      <p ref={savedGridElementRef}>{compressedGrid}</p>
    </>
  )
}
