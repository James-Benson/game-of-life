import * as React from "react"

// Generic type variables cannot be narrowed, so type assertions are used (exlanation here: https://stackoverflow.com/a/60476282)

/** Type of state <input> or <select> is being bound to */
type TState = boolean | number | string

/** Element that control expects event from */
type TElement<T extends TState> = T extends boolean
  ? HTMLInputElement
  : HTMLInputElement | HTMLSelectElement

/** Function to be used as onChange in <input> or <select> */
type TOnChange<T extends TState> = (
  event: React.ChangeEvent<TElement<T>>
) => void

/** Control to be spread onto <input> or <select> */
export type TControl<T extends TState> = T extends boolean
  ? { onChange: TOnChange<T>; checked: boolean }
  : { onChange: TOnChange<T>; value: T }

/**
 * Creates control to bind an <input> or <select> to a piece of react state
 * Numbers will be non-negative integers
 *
 * @param initialState Initial value of <input> or <select>
 * @returns Control to be spread onto <input> or <select>, & result of React.useState it will be bound to
 */
export function useInputControl(
  initialState: boolean | (() => boolean)
): [TControl<boolean>, boolean, React.Dispatch<React.SetStateAction<boolean>>]
export function useInputControl(
  initialState: number | (() => number)
): [TControl<number>, number, React.Dispatch<React.SetStateAction<number>>]
export function useInputControl(
  initialState: string | (() => string)
): [TControl<string>, string, React.Dispatch<React.SetStateAction<string>>]
export function useInputControl<T extends TState>(
  initialState: T | (() => T)
): [TControl<T>, T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = React.useState(initialState)

  const onChange: TOnChange<T> = React.useCallback(
    (event: React.ChangeEvent<TElement<T>>) => {
      switch (typeof state) {
        case "boolean":
          setState((event.target as HTMLInputElement).checked as T)
          break
        case "number":
          setState(Math.max(0, parseInt(event.target.value) || 0) as T)
          break
        case "string":
          setState(event.target.value as T)
          break
      }
    },
    [setState, state]
  )

  const control: TControl<T> = React.useMemo(() => {
    switch (typeof state) {
      case "boolean":
        return { onChange, checked: state } as TControl<T>
      case "number":
      case "string":
        return { onChange, value: state } as TControl<T>
    }
  }, [onChange, state])

  return [control, state, setState]
}
