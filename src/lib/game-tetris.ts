export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'L' | 'J'
export type Cell = PieceType | null
export type Board = Cell[][]
export type GameStatus = 'playing' | 'lost'

export const BOARD_ROWS = 20
export const BOARD_COLS = 10

type Shape = number[][]

const BASE_SHAPES: Record<PieceType, Shape> = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  L: [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  J: [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
}

function rotateShapeCW(shape: Shape): Shape {
  const rows = shape.length
  const cols = shape[0]!.length
  return Array.from({ length: cols }, (_, r) =>
    Array.from({ length: rows }, (_, c) => shape[rows - 1 - c]![r]!),
  )
}

// Precompute all 4 clockwise rotations per piece
export const PIECE_ROTATIONS: Record<PieceType, Shape[]> = (() => {
  const result = {} as Record<PieceType, Shape[]>
  for (const type of Object.keys(BASE_SHAPES) as PieceType[]) {
    const rotations: Shape[] = []
    let shape = BASE_SHAPES[type]!
    for (let i = 0; i < 4; i++) {
      rotations.push(shape)
      shape = rotateShapeCW(shape)
    }
    result[type] = rotations
  }
  return result
})()

export const PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'L', 'J']

export type Piece = {
  type: PieceType
  rotationIndex: number
  row: number
  col: number
}

export function getPieceShape(piece: Piece): Shape {
  return PIECE_ROTATIONS[piece.type]![piece.rotationIndex % 4]!
}

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array<Cell>(BOARD_COLS).fill(null),
  )
}

export function spawnPiece(type?: PieceType): Piece {
  const t = type ?? PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)]!
  const shape = PIECE_ROTATIONS[t]![0]!
  const col = Math.floor((BOARD_COLS - shape[0]!.length) / 2)
  return { type: t, rotationIndex: 0, row: 0, col }
}

export function collides(board: Board, piece: Piece): boolean {
  const shape = getPieceShape(piece)
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r]!.length; c++) {
      if (!shape[r]![c]) continue
      const br = piece.row + r
      const bc = piece.col + c
      if (br >= BOARD_ROWS || bc < 0 || bc >= BOARD_COLS) return true
      if (br >= 0 && board[br]![bc] !== null) return true
    }
  }
  return false
}

export function lockPiece(board: Board, piece: Piece): Board {
  const shape = getPieceShape(piece)
  const next = board.map((row) => [...row])
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r]!.length; c++) {
      if (!shape[r]![c]) continue
      const br = piece.row + r
      const bc = piece.col + c
      if (br >= 0 && br < BOARD_ROWS) next[br]![bc] = piece.type
    }
  }
  return next
}

export function clearLines(board: Board): {
  board: Board
  linesCleared: number
} {
  const remaining = board.filter((row) => row.some((cell) => cell === null))
  const linesCleared = BOARD_ROWS - remaining.length
  const empty = Array.from({ length: linesCleared }, () =>
    Array<Cell>(BOARD_COLS).fill(null),
  )
  return { board: [...empty, ...remaining], linesCleared }
}

export function calculateScore(linesCleared: number, level: number): number {
  const base = ([0, 100, 300, 500, 800] as const)[linesCleared] ?? 0
  return base * level
}

export function getLevel(totalLines: number): number {
  return Math.floor(totalLines / 10) + 1
}

export function getDropInterval(level: number): number {
  return Math.max(100, 1000 - (level - 1) * 80)
}

export function hardDropPiece(board: Board, piece: Piece): Piece {
  let p = { ...piece }
  while (!collides(board, { ...p, row: p.row + 1 })) {
    p = { ...p, row: p.row + 1 }
  }
  return p
}

export function rotatePiece(board: Board, piece: Piece): Piece {
  const next = { ...piece, rotationIndex: (piece.rotationIndex + 1) % 4 }
  // Wall kick offsets: center, right, left, right2, left2
  for (const offset of [0, 1, -1, 2, -2]) {
    const kicked = { ...next, col: next.col + offset }
    if (!collides(board, kicked)) return kicked
  }
  return piece
}
