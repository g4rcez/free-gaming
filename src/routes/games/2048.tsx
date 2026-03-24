import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { Spinner } from '@g4rcez/components'

const Game2048 = lazy(() =>
  import('#/components/games/game-2048').then((m) => ({
    default: m.Game2048,
  })),
)

export const Route = createFileRoute('/games/2048')({
  component: GamePage,
  head: () => ({
    meta: [{ title: '2048 — Free Gaming' }],
  }),
})

function GamePage() {
  return (
    <div className="flex flex-col items-center py-6">
      <h1
        className="mb-4 font-bold tracking-tight"
        style={{ fontSize: '1rem' }}
      >
        2048
      </h1>
      <Suspense fallback={<Spinner />}>
        <Game2048 />
      </Suspense>
    </div>
  )
}
