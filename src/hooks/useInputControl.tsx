import * as React from 'react'

interface IInputControls {
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  value: any
}

/**
 * Returns object to spread onto input to control it
 * @param state Determines value of input
 * @param setState Called when input changes
 */
export function useInputControl(state: any, setState: React.Dispatch<React.SetStateAction<any>>): IInputControls {
  const value = React.useMemo(() => (
    typeof state === 'number' ? state.toString() : state
  ), [state])

  const onChange = React.useCallback(e => {
    switch (typeof state) {
      case 'number':
        const value = parseInt(e.target.value) || 0
        setState(Math.max(value, 0))
        break
      case 'boolean':
        setState(e.target.checked)
        break
      case 'string':
        setState(e.target.value)
        break
      default:
        console.log('Unsupported input type')
    }
  }, [state, setState])

  return { onChange, value }
}
