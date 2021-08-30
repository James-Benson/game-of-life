import * as React from "react"

interface IMarkerProps {
  symbol: string
  show: boolean
}

export const Marker: React.FC<IMarkerProps> = props => {
  return (
    <strong style={{ visibility: props.show ? "visible" : "hidden" }}>
      {props.symbol}
    </strong>
  )
}
