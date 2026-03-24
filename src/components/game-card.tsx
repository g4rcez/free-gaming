import type { ReactNode } from 'react'

type GameCardProps = {
  name: string
  description: string
  href: string
  preview: ReactNode
  delay?: number
}

export function GameCard({
  name,
  description,
  href,
  preview,
  delay = 0,
}: GameCardProps) {
  return (
    <article
      className="game-card rise-in relative flex flex-col"
      style={{ animationDelay: `${delay}ms` }}
    >
      <a
        href={href}
        className="absolute inset-0 z-10"
        aria-label={`Play ${name}`}
      />
      <div
        className="flex items-center justify-center py-8"
        style={{
          background: 'var(--bg-base)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {preview}
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2
            className="m-0"
            style={{
              color: 'var(--text-bright)',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {name}
          </h2>
          <span
            style={{
              background: 'var(--success)',
              color: '#000',
              borderRadius: '999px',
              fontSize: '0.625rem',
              fontWeight: 700,
              padding: '2px 10px',
            }}
          >
            PLAY
          </span>
        </div>
        <p
          className="m-0 leading-relaxed"
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
          }}
        >
          {description}
        </p>
      </div>
    </article>
  )
}
