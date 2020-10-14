import * as React from 'react';

interface IAboutPromptProps {
  openAboutDialog: () => void
}

export const AboutPrompt: React.FC<IAboutPromptProps> = props => {
  const [showPrompt, setShowPrompt] = React.useState(localStorage.getItem('promptShown') !== 'true')

  const hidePrompt = React.useCallback(() => {
    localStorage.setItem('promptShown', 'true')
    setShowPrompt(false)
  }, [])

  const open = React.useCallback(() => {
    hidePrompt()
    props.openAboutDialog()
  }, [hidePrompt, props])

  return (
    <>
      <div className={`about-button-wrapper ${showPrompt && 'show-prompt'}`}>
        <button className='about-button' onClick={open}>About</button>
      </div>
      {showPrompt && (
        <div onClick={hidePrompt} className='prompt-background'>
          <div className='prompt'>
            I'd recommend reading the first two sections of this before starting. <br />
            Tap anywhere to close
          </div>
        </div>
      )}
    </>
  )
}