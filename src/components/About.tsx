import * as React from 'react';

export const About: React.FC = () => {

  return <>
    <h2>What is this?</h2>
    <p>
      <a href='https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life' target='blank'>Conway's Game of Life on Wikipedia</a>
    </p>

    <h2>How do I use it?</h2>
    <p>
      In the first box, you select the starting pattern.<br />
      You can choose a random pattern, a preset pattern, or a saved pattern (copied after clicking the 'Save grid' button).<br />
      For preset patterns, click 'Pattern info' to learn more about that category of pattern.
    </p>
    <p>
      In the second box, you select the size of the grid in cells, & the size of the cells in pixels.<br />
      The lock checkbox restricts those two inputs, such that the resulting size of the grid in pixels will not change.
    </p>
    <p>
      In the third box, you select how fast the game should try to run.<br />
      The actual speed will be limited by how quickly your device can calculate & draw the game, as well as the screen's refresh rate.
    </p>
    <p>
      Using the buttons, you can:
    </p>
    <ul>
      <li>Play/pause the game</li>
      <li>Update the cell size & refresh rate</li>
      <li>Start a new game</li>
      <li>Save the current state of the game. The resulting text can then be pasted in the first box, after selecting 'Load saved grid'</li>
    </ul>
    <p>
      By clicking on the cells in the grid, you can flip their state between live & dead. This can be done while paused, or while the game is running.
    </p>

    <h2>How was it made?</h2>
    <p>
      I originally made this in LÖVE, a 2d game engine that uses Lua as its scripting language.
    </p>
    <p>
      Unlike in HTML, user inputs had to be made entirely from scratch in LÖVE, & I wanted to minimise use of other peoples' code. So rather than writing them or using a component library, I restarted in React.
    </p>
    <p>
      Writing the game logic took longer, since React isn't designed for a game loop like LÖVE is, but the negatives there were outweighed by improved UI appearance & development speed, as well as a web-based app not requiring the user to download & run an executable.
    </p>

    <p>
      <a href='https://github.com/James-Benson/game-of-life' target='blank'>Project source code on Github</a>
    </p>
    <p>
      <a href='/game-of-life-windows64.zip'>LÖVE version Windows executable</a>
    </p>
    <p>
      This has only been tested on Windows 10, but to run the executable on any OS supported by LÖVE, <a href='https://love2d.org/' target='blank'>install the appropriate version of LÖVE</a>, then run <a href='game-of-life.love'>game-of-life.love</a>
    </p>
  </>
}