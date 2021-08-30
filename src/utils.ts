export interface IPatternCategory {
  name: string
  description: string
  patterns: Record<string, string>
}

/** Length of external array & lengths of internal arrays should be equal */
export type TGrid = boolean[][]

/**
 * Deep copies TGrid
 * @param grid TGrid to be cloned
 */
export const cloneGrid = (grid: TGrid): TGrid => grid.map(row => [...row])

/**
 * Increases/decreases length of external & internal arrays of TGrid to specified length
 * If increasing, pads with false
 * @param grid TGrid to be modified
 * @param size Width/height of new TGrid
 */
export const changeGridSize = (grid: TGrid, size: number): TGrid => {
  const sizeDiff = size - grid.length
  if (sizeDiff < 0) {
    grid = grid.slice(0, sizeDiff)
    grid = grid.map(row => row.slice(0, sizeDiff))
  } else if (sizeDiff > 0) {
    grid.forEach(row => {
      row.push(...Array(sizeDiff).fill(false))
    })
    grid.push(...Array(sizeDiff).fill(Array(size).fill(false)))
  }
  return grid
}

/**
 * Returns string of comma separated numbers representing TGrid
 * Flattens TGrid into boolean array, then replaces each run of the same boolean with the length of the run
 * Format: [TGrid width/height, (number of consecutive falses, number of consecutive trues)...]
 * @param grid TGrid to be compressed
 */
export const compressGrid = (grid: TGrid): string => {
  const flatGrid = grid.flat()
  const compressed = [grid.length]
  let counter = 0 // Number of consecutive same booleans
  let currentCell = false // Boolean in current consecutive run
  flatGrid.forEach(cell => {
    if (cell === currentCell) {
      counter++
    } else {
      compressed.push(counter)
      counter = 1
      currentCell = !currentCell
    }
  })
  compressed.push(counter)
  return compressed.join(",")
}

/**
 * Reverses compressGrid()
 * @param grid string of comma separated numbers, compressed grid from compressGrid()
 */
export const decompressGrid = (grid: string): TGrid => {
  const compressed: number[] = grid.split(",").map(cell => parseInt(cell))
  const size = compressed.shift() as number // Width/height of resultant grid
  let decompressed: TGrid = [] // Resulting decompressed grid
  let row = 0 // Index of decompressed grid currently being added to
  let counter = size // Number of spaces left of current row
  let currentCell = false // Boolean to be added to grid
  compressed.forEach(count => {
    // Count is current number of consecutive same booleans
    ;[decompressed, row, counter, currentCell] = decompressCells(
      size,
      decompressed,
      row,
      counter,
      currentCell,
      count
    )
  })
  return decompressed.slice(0, -1)
}

/**
 * Adds current count of booleans to current row, creating new row if current row fills up
 * @param size Width/height of resultant grid
 * @param decompressed Resulting decompressed grid
 * @param row ndex of decompressed grid currently being added to
 * @param counter Number of spaces left of current row
 * @param currentCell Boolean to be added to grid
 * @param count Remaining number of booleans to be added to grid
 */
const decompressCells = (
  size: number,
  decompressed: TGrid,
  row: number,
  counter: number,
  currentCell: boolean,
  count: number
): [TGrid, number, number, boolean] => {
  decompressed[row] = decompressed[row] ?? []
  if (row < size) {
    if (count < counter) {
      decompressed[row].push(...Array(count).fill(currentCell))
      currentCell = !currentCell
      counter -= count
    } else {
      decompressed[row].push(...Array(counter).fill(currentCell))
      count -= counter
      counter = size
      row++
      ;[decompressed, row, counter, currentCell] = decompressCells(
        size,
        decompressed,
        row,
        counter,
        currentCell,
        count
      )
    }
  }
  return [decompressed, row, counter, currentCell]
}

export const patternList: IPatternCategory[] = [
  {
    name: "Still lifes",
    description:
      "A still life is a pattern that does not change from one generation to the next.",
    patterns: {
      "Block, Beehive, Loaf, Boat, Tub":
        "15,16,2,2,2,9,2,2,1,1,1,13,1,25,1,13,1,1,1,12,1,1,1,13,1,3,1,13,1,1,1,9,1,3,1,9,1,1,1,12,1,2,1,12,2,26",
    },
  },
  {
    name: "Oscillators",
    description:
      "An oscillator is a pattern that returns to its original state after a certain number of generations (shown in brackets).",
    patterns: {
      "Blinker, Toad, Beacon (2)":
        "10,11,1,9,1,9,1,3,2,8,2,5,1,4,2,2,2,4,2,2,2,8,1,18",
      "Pulsar, Star, Cross (3)":
        "28,31,3,3,3,45,1,4,1,1,1,4,1,15,1,4,1,1,1,4,1,15,1,4,1,1,1,4,1,17,3,3,3,47,3,3,3,17,1,4,1,1,1,4,1,15,1,4,1,1,1,4,1,6,4,5,1,4,1,1,1,4,1,6,1,2,1,22,3,2,3,5,3,3,3,6,1,6,1,20,1,6,1,20,3,2,3,9,1,12,1,2,1,10,3,11,4,8,3,1,3,21,1,5,1,20,2,5,2,18,2,7,2,18,2,5,2,20,1,5,1,21,3,1,3,23,3,26,1,48",
      "Clock (4)":
        "12,4,2,10,2,22,4,7,1,4,1,1,2,3,1,1,2,1,1,1,4,1,2,3,1,3,2,1,1,4,1,7,4,22,2,10,2,4",
      "Octagon (5)": "8,3,2,5,1,2,1,3,1,4,1,1,1,6,2,6,1,1,1,4,1,3,1,2,1,5,2,3",
      "Kok's galaxy (8)":
        "13,28,6,1,2,4,6,1,2,11,2,4,2,5,2,4,2,5,2,4,2,5,2,4,2,11,2,1,6,4,2,1,6,28",
      "Pentadecathlon (15)": "17,124,1,4,1,9,2,1,4,1,2,9,1,4,1,125",
    },
  },
  {
    name: "Spaceships",
    description:
      "A spaceship is a pattern that returns to its original state in a different position after a certain number of generations (shown in brackets).",
    patterns: {
      "Glider (4)": "20,2,1,17,1,1,1,18,2,357",
      "Light-weight spaceship (4)": "20,0,1,1,1,20,1,19,1,16,1,2,1,17,3,316",
      "Medium-weight spaceship (4)":
        "20,1,1,1,1,20,1,15,1,3,1,19,1,16,1,2,1,17,3,295",
      "Heavy-weight spaceship (4)":
        "20,1,1,1,1,20,1,15,1,3,1,15,1,3,1,19,1,16,1,2,1,17,3,275",
    },
  },
  {
    name: "Methuselahs",
    description:
      "A methuselah is a small pattern that stabilises after a large number of generations (shown in brackets).",
    patterns: {
      "R-pentomino (1103)": "130,9416,1,129,3,128,1,7222",
      "Diehard (130)": "30,309,1,29,2,119,1,27,1,1,1,29,1,379",
      "Acorn (5206)": "240,36385,1,237,1,1,1,478,1,240,1,239,1,239,1,19774",
    },
  },
  {
    name: "Guns",
    description:
      "A gun is a pattern that returns to its original state after a certain number of generations, while launching spaceships.",
    patterns: {
      "Gosper glider gun":
        "36,7,2,34,2,322,3,32,1,3,1,30,1,5,1,29,1,5,1,32,1,33,1,3,1,32,3,34,1,104,3,33,3,32,1,3,1,66,2,3,2,355,2,34,2,29",
    },
  },
]
