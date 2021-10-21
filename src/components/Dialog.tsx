import * as React from "react"

interface IProps {
  closeDialog: () => void
  showDialog: boolean
}

export const Dialog: React.FC<IProps> = props => {
  if (props.showDialog) {
    return (
      <div className="dialog-background">
        <div className="dialog">
          <button onClick={props.closeDialog}>Close</button>
          <div className="content">{props.children}</div>
        </div>
      </div>
    )
  } else {
    return null
  }
}
