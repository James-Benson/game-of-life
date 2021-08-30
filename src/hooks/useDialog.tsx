import * as React from "react"

/** Returns dialog component, & function to open the dialog & set its contents */
export function useDialog(): [React.FC, (content?: JSX.Element) => void] {
  const [content, setContent] = React.useState<JSX.Element>()
  const [dialogOpen, setDialogOpen] = React.useState(false)

  /** Open dialog, & optionally set content */
  const openDialog = React.useCallback((content?: JSX.Element) => {
    if (content) {
      setContent(content)
    }
    setDialogOpen(true)
  }, [])

  /** Dialog with close button & custom contents, that blocks use of rest of screen */
  const Dialog: React.FC = () =>
    dialogOpen ? (
      <div className="dialog-background">
        <div className="dialog">
          <button onClick={() => setDialogOpen(false)}>Close</button>
          <div className="content">{content}</div>
        </div>
      </div>
    ) : (
      <></>
    )

  return [Dialog, openDialog]
}
