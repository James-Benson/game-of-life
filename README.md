This project is an implementation of The Game of Life, a cellular automation devised by John Horton Conway [(Wikipedia page)](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

# Executable version

Made using [LÖVE](http://love2d.org/)  
To run locally, install LÖVE, then run `<love.exe path> <project root path>/lua`  
This version allows you to:

- Choose percentage of cells to start live
- Choose size of cells in pixels
- Choose size of grid in cells
- Choose game speed
- Update cell size & game speed of current game
- Start new game with all changed properties
- Play/pause game
- Toggle cells between live/dead

# Web version

The web version is made using [Typescript](https://www.typescriptlang.org/), [React](https://reactjs.org/), & [Sass](https://sass-lang.com/)  
To run locally, install [npm](https://www.npmjs.com/get-npm), then follow the [Create React App instructions](CreateReactApp_README.md)  
This version has all the features of the executable version, as well as allowing you to:

- Choose from a number of preset patterns
- Save & load grid states
