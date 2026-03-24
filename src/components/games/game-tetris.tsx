import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useReducer } from 'use-typed-reducer'
import { Button, Card } from '@g4rcez/components'
import { useSwipeDirection } from '#/hooks/use-swipe-direction'
import { useArcadeStore } from '#/stores/arcade-store'
import {
  createEmptyBoard,
  spawnPiece,
  collides,
  lockPiece,
  clearLines,
  calculateScore,
  getLevel,
  getDropInterval,
  hardDropPiece,
  rotatePiece,
  getPieceShape,
  BOARD_ROWS,
  BOARD_COLS,
} from '#/lib/game-tetris'
import type { Board, GameStatus, Piece, PieceType } from '#/lib/game-tetris'
import { TetrisCell } from './tetris-cell'

type TetrisState = {
  board: Board
  currentPiece: Piece
  nextPiece: Piece
  score: number
  level: number
  totalLines: number
  status: GameStatus
}

function makeInitialState(): TetrisState {
  return {
    board: createEmptyBoard(),
    currentPiece: spawnPiece(),
    nextPiece: spawnPiece(),
    score: 0,
    level: 1,
    totalLines: 0,
    status: 'playing',
  }
}

const initialState: TetrisState = makeInitialState()

// Render the next piece centered in a 4×4 preview grid
function NextPiecePreview({ piece }: { piece: Piece }) {
  const shape = getPieceShape(piece)
  const rOffset = Math.floor((4 - shape.length) / 2)
  const cOffset = Math.floor((4 - shape[0]!.length) / 2)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 14px)',
        gap: '2px',
      }}
    >
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => {
          const sr = r - rOffset
          const sc = c - cOffset
          const filled =
            sr >= 0 &&
            sr < shape.length &&
            sc >= 0 &&
            sc < shape[sr]!.length &&
            !!shape[sr]![sc]
          return (
            <TetrisCell key={`${r}-${c}`} cell={filled ? piece.type : null} />
          )
        }),
      )}
    </div>
  )
}

export function GameTetris() {
  const setHighScore = useArcadeStore((s) => s.setHighScore)
  const bestScore = useArcadeStore((s) => s.getBestScore('tetris'))

  const [state, actions] = useReducer(initialState, (args) => ({
    moveLeft() {
      const { board, currentPiece, status } = args.state()
      if (status !== 'playing') return {}
      const moved = { ...currentPiece, col: currentPiece.col - 1 }
      if (collides(board, moved)) return {}
      return { currentPiece: moved }
    },
    moveRight() {
      const { board, currentPiece, status } = args.state()
      if (status !== 'playing') return {}
      const moved = { ...currentPiece, col: currentPiece.col + 1 }
      if (collides(board, moved)) return {}
      return { currentPiece: moved }
    },
    moveDown() {
      const { board, currentPiece, status } = args.state()
      if (status !== 'playing') return {}
      const moved = { ...currentPiece, row: currentPiece.row + 1 }
      if (!collides(board, moved)) return { currentPiece: moved }
      return lockAndSpawn(args.state())
    },
    hardDrop() {
      const { board, currentPiece, status } = args.state()
      if (status !== 'playing') return {}
      const dropped = hardDropPiece(board, currentPiece)
      return lockAndSpawn({ ...args.state(), currentPiece: dropped })
    },
    rotate() {
      const { board, currentPiece, status } = args.state()
      if (status !== 'playing') return {}
      return { currentPiece: rotatePiece(board, currentPiece) }
    },
    tick() {
      const { board, currentPiece, status } = args.state()
      if (status !== 'playing') return {}
      const moved = { ...currentPiece, row: currentPiece.row + 1 }
      if (!collides(board, moved)) return { currentPiece: moved }
      return lockAndSpawn(args.state())
    },
    reset() {
      return makeInitialState()
    },
  }))

  // High score sync
  const prevScore = useRef(0)
  useEffect(() => {
    if (state.score > prevScore.current) {
      prevScore.current = state.score
      setHighScore('tetris', state.score)
    }
  }, [state.score, setHighScore])

  // Gravity interval
  useEffect(() => {
    if (state.status !== 'playing') return
    const id = setInterval(() => actions.tick(), getDropInterval(state.level))
    return () => clearInterval(id)
  }, [state.level, state.status, actions])

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        [
          'ArrowLeft',
          'ArrowRight',
          'ArrowDown',
          'ArrowUp',
          ' ',
          'r',
          'R',
        ].includes(e.key)
      ) {
        e.preventDefault()
      }
      switch (e.key) {
        case 'ArrowLeft':
          actions.moveLeft()
          break
        case 'ArrowRight':
          actions.moveRight()
          break
        case 'ArrowDown':
          actions.hardDrop()
          break
        case 'ArrowUp':
        case ' ':
        case 'r':
        case 'R':
          actions.rotate()
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [actions])

  // Swipe handler for touch/mouse
  const swipeHandlers = useSwipeDirection((dir) => {
    if (dir === 'left') actions.moveLeft()
    else if (dir === 'right') actions.moveRight()
    else if (dir === 'down') actions.hardDrop()
    else if (dir === 'up') actions.rotate()
  })

  // Compute ghost piece position
  const ghostPiece =
    state.status === 'playing'
      ? hardDropPiece(state.board, state.currentPiece)
      : null

  // Build cell lookup maps for current and ghost pieces
  const activeCells = new Map<string, PieceType>()
  const ghostCells = new Set<string>()

  if (ghostPiece) {
    const shape = getPieceShape(ghostPiece)
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r]!.length; c++) {
        if (shape[r]![c])
          ghostCells.add(`${ghostPiece.row + r}-${ghostPiece.col + c}`)
      }
    }
  }

  const currentShape = getPieceShape(state.currentPiece)
  for (let r = 0; r < currentShape.length; r++) {
    for (let c = 0; c < currentShape[r]!.length; c++) {
      if (currentShape[r]![c]) {
        activeCells.set(
          `${state.currentPiece.row + r}-${state.currentPiece.col + c}`,
          state.currentPiece.type,
        )
      }
    }
  }

  return (
    <div
      className="flex flex-col items-center gap-4 p-4"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Score bar */}
      <div className="flex w-full max-w-xs gap-2">
        <Card
          title="Score"
          titleClassName="text-center text-xs uppercase tracking-widest opacity-60"
          container="pt-1 pb-2 text-center"
          className="flex-1"
        >
          <motion.span
            key={state.score}
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-bold"
          >
            {state.score}
          </motion.span>
        </Card>
        <Card
          title="Level"
          titleClassName="text-center text-xs uppercase tracking-widest opacity-60"
          container="pt-1 pb-2 text-center"
          className="flex-1"
        >
          <span className="text-xl font-bold">{state.level}</span>
        </Card>
        <Card
          title="Best"
          titleClassName="text-center text-xs uppercase tracking-widest opacity-60"
          container="pt-1 pb-2 text-center"
          className="flex-1"
        >
          <span className="text-xl font-bold">{bestScore}</span>
        </Card>
      </div>

      {/* Board + side panel */}
      <div className="flex gap-4 items-start">
        {/* Game board */}
        <div className="relative">
          <div
            {...swipeHandlers}
            className="grid cursor-grab select-none touch-none"
            style={{
              gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`,
              width: 'min(70vw, 220px)',
              background: 'var(--color-tetris-board, #1a1a2e)',
              padding: '3px',
              gap: '2px',
            }}
          >
            {state.board.flatMap((row, r) =>
              row.map((cell, c) => {
                const key = `${r}-${c}`
                const activeType = activeCells.get(key)
                const isGhost = ghostCells.has(key) && !activeType
                return (
                  <TetrisCell
                    key={key}
                    cell={activeType ?? cell}
                    isGhost={isGhost}
                  />
                )
              }),
            )}
          </div>

          {/* Game over overlay */}
          <AnimatePresence>
            {state.status === 'lost' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'oklch(0.15 0 0 / 90%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                }}
              >
                <motion.p
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#f3faf5',
                    textAlign: 'center',
                  }}
                >
                  Game Over
                </motion.p>
                <Button onClick={() => actions.reset()}>New Game</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Side panel */}
        <div
          className="flex flex-col gap-4 items-center"
          style={{ minWidth: '64px' }}
        >
          {/* Next piece */}
          <div>
            <p
              className="text-center mb-2"
              style={{
                fontSize: '9px',
                opacity: 0.6,
                textTransform: 'uppercase',
              }}
            >
              Next
            </p>
            <NextPiecePreview piece={state.nextPiece} />
          </div>

          {/* Rotate button */}
          <Button
            onClick={() => actions.rotate()}
            theme="secondary"
            size="small"
          >
            Rotate
          </Button>

          {/* New game */}
          <Button
            onClick={() => actions.reset()}
            theme="ghost-neutral"
            size="small"
          >
            New
          </Button>
        </div>
      </div>

      <p
        className="text-center"
        style={{ fontSize: '9px', opacity: 0.5, maxWidth: '260px' }}
      >
        ←/→ to move · ↑ / Space / R to rotate · ↓ to drop
      </p>
    </div>
  )
}

// Helper used inside reducer actions
function lockAndSpawn(state: TetrisState): Partial<TetrisState> {
  const locked = lockPiece(state.board, state.currentPiece)
  const { board: cleared, linesCleared } = clearLines(locked)
  const newTotalLines = state.totalLines + linesCleared
  const newLevel = getLevel(newTotalLines)
  const newScore = state.score + calculateScore(linesCleared, newLevel)
  const newCurrent = spawnPiece(state.nextPiece.type)
  const newNext = spawnPiece()

  if (collides(cleared, newCurrent)) {
    return {
      board: cleared,
      currentPiece: newCurrent,
      score: newScore,
      level: newLevel,
      totalLines: newTotalLines,
      status: 'lost' as GameStatus,
    }
  }

  return {
    board: cleared,
    currentPiece: newCurrent,
    nextPiece: newNext,
    score: newScore,
    level: newLevel,
    totalLines: newTotalLines,
  }
}
