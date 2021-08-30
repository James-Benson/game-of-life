import * as React from "react"

export type TDep<T> = [T, boolean]

/** When calling setNewState, hooks dependant on stateDep will be re-evaluated, even if state does not change */
export function useNewState<T>(
  initialState: T
): [T, TDep<T>, (newState: T) => void] {
  const [state, setState] = React.useState<T>(initialState)
  const [stateDep, setStateDep] = React.useState<TDep<T>>([initialState, false])

  const setNewState = React.useCallback(
    (newState: T) => {
      setStateDep([newState, !stateDep?.[1]])
      setState(newState)
    },
    [stateDep]
  )

  return [state, stateDep, setNewState]
}
