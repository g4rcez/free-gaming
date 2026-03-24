import { useEffect, useState } from 'react'

type C = string | null

const COLORS: Record<string, string> = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  L: '#f0a000',
  J: '#0000f0',
}

// 6 columns × 10 rows preview
type MiniBoard = C[][]

const FRAMES: MiniBoard[] = [
  // Frame 1: base blocks + L piece falling
  [
    [null, null, null, null, null, null],
    [null, null, 'L', null, null, null],
    [null, null, 'L', null, null, null],
    [null, null, 'L', 'L', null, null],
    [null, null, null, null, null, null],
    ['Z', 'Z', null, null, null, null],
    [null, 'Z', 'Z', null, null, null],
    ['J', null, null, 'I', 'I', 'I'],
    ['J', null, null, null, null, null],
    ['J', 'J', 'S', 'S', 'T', null],
  ],
  // Frame 2: L landed, T piece appearing
  [
    [null, null, null, 'T', null, null],
    [null, null, null, 'T', 'T', null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    ['Z', 'Z', null, null, null, null],
    [null, 'Z', 'Z', null, null, null],
    ['J', null, null, 'I', 'I', 'I'],
    ['J', null, 'L', null, null, null],
    ['J', 'J', 'L', null, null, null],
    ['S', 'S', 'L', 'L', 'T', null],
  ],
  // Frame 3: T moving down
  [
    [null, null, null, null, null, null],
    [null, null, null, 'T', null, null],
    [null, null, null, 'T', 'T', null],
    [null, null, null, null, null, null],
    ['Z', 'Z', null, null, null, null],
    [null, 'Z', 'Z', null, null, null],
    ['J', null, null, 'I', 'I', 'I'],
    ['J', null, 'L', null, null, null],
    ['J', 'J', 'L', null, null, null],
    ['S', 'S', 'L', 'L', 'T', null],
  ],
  // Frame 4: I piece appearing, T locked
  [
    ['I', 'I', 'I', 'I', null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, 'T', null, null],
    ['Z', 'Z', null, 'T', 'T', null],
    [null, 'Z', 'Z', null, null, null],
    ['J', null, null, 'I', 'I', 'I'],
    ['J', null, 'L', null, null, null],
    ['J', 'J', 'L', null, 'T', null],
    ['S', 'S', 'L', 'L', 'T', 'T'],
  ],
  // Frame 5: line cleared, I piece lower
  [
    [null, null, null, null, null, null],
    ['I', 'I', 'I', 'I', null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    ['Z', 'Z', null, 'T', null, null],
    [null, 'Z', 'Z', 'T', 'T', null],
    ['J', null, null, null, null, null],
    ['J', null, 'L', null, null, null],
    ['J', 'J', 'L', null, 'T', null],
    ['S', 'S', 'L', 'L', 'T', 'T'],
  ],
]

const CELL_SIZE = 16
const COLS = 6
const ROWS = 10

export function PreviewTetris() {
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setFrameIndex((i) => (i + 1) % FRAMES.length),
      1100,
    )
    return () => clearInterval(id)
  }, [])

  const board = FRAMES[frameIndex]!

  return (
    <div
      aria-hidden
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
        gap: '2px',
        background: '#1a1a2e',
        padding: '4px',
      }}
    >
      {board.flatMap((row, r) =>
        row.map((cell, c) => {
          const color = cell ? COLORS[cell] : null
          return (
            <div
              key={`${r}-${c}`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                background: color ?? '#0d0d22',
                boxShadow: color
                  ? 'inset 2px 2px 0 rgba(255,255,255,0.3), inset -2px -2px 0 rgba(0,0,0,0.25)'
                  : undefined,
              }}
            />
          )
        }),
      )}
    </div>
  )
}
