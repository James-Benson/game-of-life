import * as React from "react"
import * as ReactDOM from "react-dom"

interface IProps {
  closeDialog: () => void
  showDialog: boolean
}

export const Dialog: React.FC<IProps> = props => {
  const dialogContainer = React.useMemo(() => document.createElement("div"), [])

  const dialog = props.showDialog ? (
    <div className="dialog-background">
      <div className="dialog">
        <button onClick={props.closeDialog}>Close</button>
        <div className="content">{props.children}</div>
      </div>
    </div>
  ) : null

  React.useEffect(() => {
    document.body.appendChild(dialogContainer)
    return () => {
      document.body.removeChild(dialogContainer)
    }
  }, [dialogContainer])

  return ReactDOM.createPortal(dialog, dialogContainer)
}
