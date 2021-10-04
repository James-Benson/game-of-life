import * as React from "react"
import { TControl } from "../hooks/useInputControl"
import { patternList } from "../utils"
import { Marker } from "./Marker"

interface IPatternSelector {
  pattern: string
  patternInput: string
  patternInputControl: TControl<string>
  customPattern: string
  customPatternInput: string
  customPatternInputControl: TControl<string>
  odds: number
  oddsInput: number
  oddsInputControl: TControl<number>
  openPatternInfoDialog: () => void
}

export const PatternSelector: React.FC<IPatternSelector> = props => {
  const info = React.useMemo(() => {
    let patternSize
    switch (props.patternInput) {
      case "Random":
        return (
          <>
            <label htmlFor="odds">Cells starting live (%)</label>
            <input type="number" id="odds" {...props.oddsInputControl} />
            <Marker show={props.oddsInput !== props.odds} symbol="*" />
          </>
        )
      case "Load":
        patternSize = parseInt(props.customPatternInput)
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
              {...props.customPatternInputControl}
            />
            <Marker
              show={props.customPatternInput !== props.customPattern}
              symbol="*"
            />
          </>
        )
      default:
        patternSize = parseInt(props.patternInput)
        return (
          <>
            <span>Min grid width: {patternSize} cells</span>
            <button onClick={props.openPatternInfoDialog}>Pattern info</button>
          </>
        )
    }
  }, [
    props.customPattern,
    props.customPatternInput,
    props.customPatternInputControl,
    props.odds,
    props.oddsInput,
    props.oddsInputControl,
    props.openPatternInfoDialog,
    props.patternInput,
  ])

  return (
    <>
      <label htmlFor="pattern">Choose pattern</label>
      <select id="pattern" {...props.patternInputControl}>
        {props.patternInput === "" && (
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
      <Marker show={props.pattern !== props.patternInput} symbol="*" />
      {info}
    </>
  )
}
