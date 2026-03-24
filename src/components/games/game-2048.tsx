import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useReducer } from 'use-typed-reducer'
import { Button, Card } from '@g4rcez/components'
import { useSwipeDirection } from '#/hooks/use-swipe-direction'
import { useArcadeStore } from '#/stores/arcade-store'
import {
  initializeGrid,
  move,
  addRandomTile,
  hasWon,
  hasAvailableMoves,
} from '#/lib/game-2048'
import type { Direction, GameStatus, Grid } from '#/lib/game-2048'
import { GameTile } from './game-tile'

type GameState = {
  grid: Grid
  score: number
  status: GameStatus
  hasWonOnce: boolean
}

const initialState: GameState = {
  grid: initializeGrid(),
  score: 0,
  status: 'playing',
  hasWonOnce: false,
}

export function Game2048() {
  const setHighScore = useArcadeStore((s) => s.setHighScore)
  const bestScore = useArcadeStore((s) => s.getBestScore('2048'))

  const [state, actions] = useReducer(initialState, (args) => ({
    move(direction: Direction) {
      const { grid, score, status, hasWonOnce } = args.state()
      if (status === 'lost') return {}
      if (status === 'won') return {}

      const result = move(grid, direction)
      if (!result.moved) return {}

      const newGrid = addRandomTile(result.grid)
      const newScore = score + result.score
      const won = !hasWonOnce && hasWon(newGrid)
      const lost = !hasAvailableMoves(newGrid)
      const newStatus: GameStatus = won ? 'won' : lost ? 'lost' : 'playing'

      return {
        grid: newGrid,
        score: newScore,
        status: newStatus,
        hasWonOnce: hasWonOnce || won,
      }
    },
    reset() {
      return { ...initialState, grid: initializeGrid() }
    },
    continueAfterWin() {
      return { status: 'playing' as GameStatus }
    },
  }))

  // Sync high score to store
  const prevScore = useRef(0)
  useEffect(() => {
    if (state.score > prevScore.current) {
      prevScore.current = state.score
      setHighScore('2048', state.score)
    }
  }, [state.score, setHighScore])

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      }
      const dir = map[e.key]
      if (!dir) return
      e.preventDefault()
      actions.move(dir)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [actions])

  const swipeHandlers = useSwipeDirection((dir) => actions.move(dir))

  return (
    <div
      className="flex flex-col items-center gap-4 p-4"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Score bar */}
      <div className="flex w-full max-w-sm gap-3">
        <Card
          title="Score"
          titleClassName="text-center text-xs uppercase tracking-widest opacity-60"
          container="pt-1 pb-3 text-center"
          className="flex-1"
        >
          <motion.span
            key={state.score}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold"
          >
            {state.score}
          </motion.span>
        </Card>
        <Card
          title="Best"
          titleClassName="text-center text-xs uppercase tracking-widest opacity-60"
          container="pt-1 pb-3 text-center"
          className="flex-1"
        >
          <span className="text-2xl font-bold">{bestScore}</span>
        </Card>
      </div>

      {/* Game board */}
      <div className="relative">
        <div
          {...swipeHandlers}
          className="grid cursor-grab select-none grid-cols-4 gap-2 rounded-lg bg-game2048-board p-2 touch-none"
          style={{ width: 'min(90vw, 20rem)' }}
        >
          {state.grid.flatMap((row: number[], r: number) =>
            row.map((cell: number, c: number) => (
              <GameTile key={`${r}-${c}`} value={cell} />
            )),
          )}
        </div>

        {/* Win / Lose overlay */}
        <AnimatePresence>
          {(state.status === 'won' || state.status === 'lost') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '0.5rem',
                background:
                  state.status === 'won'
                    ? 'oklch(0.68 0.22 75 / 90%)'
                    : 'oklch(0.15 0 0 / 85%)',
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
                  color: state.status === 'won' ? '#fff' : '#f3faf5',
                }}
              >
                {state.status === 'won' ? 'You Win! 🎉' : 'Game Over'}
              </motion.p>
              <div className="flex gap-2">
                {state.status === 'won' && (
                  <Button
                    theme="secondary"
                    onClick={() => actions.continueAfterWin()}
                  >
                    Keep Going
                  </Button>
                )}
                <Button onClick={() => actions.reset()}>New Game</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        theme="ghost-neutral"
        size="small"
        onClick={() => actions.reset()}
      >
        New Game
      </Button>
      <p className="text-xs opacity-60 text-center">
        Use arrow keys, swipe, or drag to move tiles
      </p>
    </div>
  )
}
