export type Direction = 'up' | 'down' | 'left' | 'right'
export type GameStatus = 'playing' | 'won' | 'lost'
export type Cell = number
export type Grid = Cell[][]

const SIZE = 4

export function createEmptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
}

export function addRandomTile(grid: Grid): Grid {
  const empty: [number, number][] = []
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r]![c] === 0) empty.push([r, c])
    }
  }
  if (empty.length === 0) return grid
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]!
  const value = Math.random() < 0.9 ? 2 : 4
  return grid.map((row, ri) =>
    row.map((cell, ci) => (ri === r && ci === c ? value : cell)),
  )
}

export function initializeGrid(): Grid {
  return addRandomTile(addRandomTile(createEmptyGrid()))
}

export function slideRow(row: Cell[]): { result: Cell[]; score: number } {
  const nonZero = row.filter((v) => v !== 0)
  const merged: Cell[] = []
  let score = 0
  let i = 0
  while (i < nonZero.length) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const val = nonZero[i]! * 2
      merged.push(val)
      score += val
      i += 2
    } else {
      merged.push(nonZero[i]!)
      i++
    }
  }
  while (merged.length < SIZE) merged.push(0)
  return { result: merged, score }
}

function rotateClockwise(grid: Grid): Grid {
  return Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (_, c) => grid[SIZE - 1 - c]![r]!),
  )
}

function rotateCounterClockwise(grid: Grid): Grid {
  return Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (_, c) => grid[c]![SIZE - 1 - r]!),
  )
}

export function move(
  grid: Grid,
  direction: Direction,
): { grid: Grid; score: number; moved: boolean } {
  // Normalize: rotate so that all moves become left-slide.
  // "up"   → CCW rotation maps column-top to row-left → slide left → CW back
  // "down" → CW  rotation maps column-bottom to row-left → slide left → CCW back
  // "right"→ 180° rotation → slide left → 180° back
  let rotated = grid
  if (direction === 'up') rotated = rotateCounterClockwise(grid)
  else if (direction === 'down') rotated = rotateClockwise(grid)
  else if (direction === 'right') {
    rotated = rotateClockwise(rotateClockwise(grid))
  }

  let totalScore = 0
  let moved = false
  const slid = rotated.map((row) => {
    const { result, score } = slideRow(row)
    totalScore += score
    if (result.some((v, i) => v !== row[i])) moved = true
    return result
  })

  // Rotate back
  let result = slid
  if (direction === 'up') result = rotateClockwise(slid)
  else if (direction === 'down') result = rotateCounterClockwise(slid)
  else if (direction === 'right') {
    result = rotateClockwise(rotateClockwise(slid))
  }

  return { grid: result, score: totalScore, moved }
}

export function hasWon(grid: Grid): boolean {
  return grid.some((row) => row.some((cell) => cell === 2048))
}

export function hasAvailableMoves(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r]![c] === 0) return true
      if (c + 1 < SIZE && grid[r]![c] === grid[r]![c + 1]) return true
      if (r + 1 < SIZE && grid[r]![c] === grid[r + 1]![c]) return true
    }
  }
  return false
}
