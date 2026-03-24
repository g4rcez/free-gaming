import type { PieceType } from '#/lib/game-tetris'

const PIECE_COLORS: Record<PieceType, string> = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  L: '#f0a000',
  J: '#0000f0',
}

type TetrisCellProps = {
  cell: PieceType | null
  isGhost?: boolean
}

export function TetrisCell({ cell, isGhost }: TetrisCellProps) {
  if (!cell) {
    return (
      <div
        style={{
          background: 'var(--color-tetris-empty, #0d0d22)',
          aspectRatio: '1',
        }}
      />
    )
  }

  const color = PIECE_COLORS[cell]

  if (isGhost) {
    return (
      <div
        style={{
          background: 'transparent',
          border: `2px solid ${color}`,
          opacity: 0.3,
          aspectRatio: '1',
          boxSizing: 'border-box',
        }}
      />
    )
  }

  return (
    <div
      style={{
        background: color,
        aspectRatio: '1',
        boxShadow:
          'inset 3px 3px 0 rgba(255,255,255,0.35), inset -3px -3px 0 rgba(0,0,0,0.3)',
      }}
    />
  )
}
