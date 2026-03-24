import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { Spinner } from '@g4rcez/components'

const GameTetris = lazy(() =>
  import('#/components/games/game-tetris').then((m) => ({
    default: m.GameTetris,
  })),
)

export const Route = createFileRoute('/games/tetris')({
  component: TetrisPage,
  head: () => ({
    meta: [{ title: 'Tetris — Free Gaming' }],
  }),
})

function TetrisPage() {
  return (
    <div className="flex flex-col items-center py-6">
      <h1
        className="mb-4 font-bold tracking-tight"
        style={{ fontSize: '1rem' }}
      >
        Tetris
      </h1>
      <Suspense fallback={<Spinner />}>
        <GameTetris />
      </Suspense>
    </div>
  )
}
