import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const TILE_COLORS: Record<number, { bg: string; fg: string }> = {
  2: { bg: '#eee4da', fg: '#776e65' },
  4: { bg: '#ede0c8', fg: '#776e65' },
  8: { bg: '#f2b179', fg: '#f9f6f2' },
  16: { bg: '#f59563', fg: '#f9f6f2' },
  32: { bg: '#f67c5f', fg: '#f9f6f2' },
  64: { bg: '#f65e3b', fg: '#f9f6f2' },
  128: { bg: '#edcf72', fg: '#f9f6f2' },
  256: { bg: '#edcc61', fg: '#f9f6f2' },
}

type Grid = number[][]

const FRAMES: Grid[] = [
  [
    [0, 0, 0, 0],
    [0, 2, 0, 0],
    [0, 0, 0, 2],
    [0, 0, 2, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 2, 4],
    [0, 2, 4, 2],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 8],
    [2, 0, 4, 4],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 2],
    [0, 0, 4, 8],
    [2, 4, 0, 4],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 16],
    [2, 4, 8, 4],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 4, 16],
    [2, 4, 8, 8],
  ],
]

export function Preview2048() {
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((i) => (i + 1) % FRAMES.length)
    }, 1100)
    return () => clearInterval(timer)
  }, [])

  const grid = FRAMES[frameIndex]

  return (
    <div
      aria-hidden
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '5px',
        padding: '6px',
        background: '#bbada0',
        borderRadius: '8px',
        width: '112px',
        height: '112px',
      }}
    >
      {grid.flatMap((row, r) =>
        row.map((cell, c) => {
          const colors = TILE_COLORS[cell]
          return (
            <div
              key={`${r}-${c}`}
              style={{
                position: 'relative',
                borderRadius: '4px',
                background: '#cdc1b4',
                overflow: 'hidden',
              }}
            >
              <AnimatePresence>
                {cell !== 0 && colors && (
                  <motion.div
                    key={`${r}-${c}-${cell}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: colors.bg,
                      color: colors.fg,
                      fontWeight: 700,
                      fontSize: cell >= 100 ? '7px' : '9px',
                      borderRadius: '4px',
                    }}
                  >
                    {cell}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        }),
      )}
    </div>
  )
}
