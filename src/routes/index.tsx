import { createFileRoute } from '@tanstack/react-router'
import { GameCard } from '#/components/game-card'
import { Preview2048 } from '#/components/previews/preview-2048'
import { PreviewTetris } from '#/components/previews/preview-tetris'

export const Route = createFileRoute('/')({ component: App })

const GAMES = [
  {
    name: '2048',
    description:
      'Slide tiles to combine matching numbers and reach the 2048 tile.',
    href: '/games/2048',
    preview: <Preview2048 />,
  },
  {
    name: 'Tetris',
    description:
      'Stack falling blocks, clear lines, and survive as the speed increases.',
    href: '/games/tetris',
    preview: <PreviewTetris />,
  },
]

function App() {
  return (
    <main className="page-wrap px-4 pb-16 pt-10">
      <section className="hero-section rise-in px-6 py-12 text-center sm:px-10 sm:py-16">
        <p className="section-label mb-4">&#9654; Browser Games &#9654;</p>
        <h1
          className="mb-4"
          style={{
            color: 'var(--text-bright)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
          }}
        >
          Free Gaming
        </h1>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.6,
            maxWidth: '520px',
            margin: '0 auto',
          }}
        >
          Curated browser games. No ads, no installs — just play.
        </p>
      </section>

      <section className="mt-10">
        <p className="section-label mb-5">&#9654; All Games &#9654;</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((game, index) => (
            <GameCard
              key={game.name}
              name={game.name}
              description={game.description}
              href={game.href}
              preview={game.preview}
              delay={index * 90 + 60}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
