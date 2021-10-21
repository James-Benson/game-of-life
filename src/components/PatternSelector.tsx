import * as React from "react"
import { GameContext } from "../gameContext"
import { patternList } from "../utils"
import { Marker } from "./Marker"

interface IPatternSelector {
  openPatternInfoDialog: () => void
}

export const PatternSelector: React.FC<IPatternSelector> = props => {
  const {
    oddsInputControl,
    oddsInput,
    patternInputControl,
    patternInput,
    customPatternInputControl,
    customPatternInput,
    odds,
    pattern,
    customPattern,
  } = React.useContext(GameContext)

  const info = React.useMemo(() => {
    let patternSize
    switch (patternInput) {
      case "Random":
        return (
          <>
            <label htmlFor="odds">Cells starting live (%)</label>
            <input type="number" id="odds" {...oddsInputControl} />
            <Marker show={oddsInput !== odds} symbol="*" />
          </>
        )
      case "Load":
        patternSize = parseInt(customPatternInput)
        return (
          <>
            <label htmlFor="customPattern">
              {patternSize
                ? `Min grid width: ${patternSize} cells`
                : "Paste saved grid"}
            </label>
            <input
              type="string"
              id="customPattern"
              {...customPatternInputControl}
            />
            <Marker show={customPatternInput !== customPattern} symbol="*" />
          </>
        )
      default:
        patternSize = parseInt(patternInput)
        return (
          <>
            <span>Min grid width: {patternSize} cells</span>
            <button onClick={props.openPatternInfoDialog}>Pattern info</button>
          </>
        )
    }
  }, [
    customPattern,
    customPatternInput,
    customPatternInputControl,
    odds,
    oddsInput,
    oddsInputControl,
    patternInput,
    props.openPatternInfoDialog,
  ])

  return (
    <>
      <label htmlFor="pattern">Choose pattern</label>
      <select id="pattern" {...patternInputControl}>
        {patternInput === "" && (
          <option value="" disabled>
            Select pattern
          </option>
        )}
        <option value="Random">Random</option>
        <option value="Load">Load saved grid</option>

        {patternList.map(category => [
          <option disabled key={category.name} value={category.name}>
            ~~{category.name}~~
          </option>,
          Object.entries(category.patterns).map(([name, pattern]) => (
            <option key={name} value={[pattern]}>
              {name}
            </option>
          )),
        ])}
      </select>
      <Marker show={pattern !== patternInput} symbol="*" />
      {info}
    </>
  )
}
