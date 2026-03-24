import { motion, AnimatePresence } from 'motion/react'
import { css } from '@g4rcez/components'

const TILE_CLASSES: Record<number, string> = {
  2: 'bg-game2048-tile2-bg text-game2048-tile2-fg',
  4: 'bg-game2048-tile4-bg text-game2048-tile4-fg',
  8: 'bg-game2048-tile8-bg text-game2048-tile8-fg',
  16: 'bg-game2048-tile16-bg text-game2048-tile16-fg',
  32: 'bg-game2048-tile32-bg text-game2048-tile32-fg',
  64: 'bg-game2048-tile64-bg text-game2048-tile64-fg',
  128: 'bg-game2048-tile128-bg text-game2048-tile128-fg',
  256: 'bg-game2048-tile256-bg text-game2048-tile256-fg',
  512: 'bg-game2048-tile512-bg text-game2048-tile512-fg',
  1024: 'bg-game2048-tile1024-bg text-game2048-tile1024-fg',
  2048: 'bg-game2048-tile2048-bg text-game2048-tile2048-fg',
}

function getFontSize(value: number): string {
  if (value >= 1024) return 'clamp(0.5rem, 1.5vw, 0.7rem)'
  if (value >= 128) return 'clamp(0.6rem, 2vw, 0.85rem)'
  return 'clamp(0.75rem, 2.5vw, 1rem)'
}

type GameTileProps = {
  value: number
}

export function GameTile({ value }: GameTileProps) {
  const isEmpty = value === 0
  const tileClasses =
    TILE_CLASSES[value] ?? 'bg-game2048-tile2048-bg text-game2048-tile2048-fg'

  return (
    <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-game2048-empty">
      <AnimatePresence>
        {!isEmpty && (
          <motion.div
            key={value}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={css(
              'absolute inset-0 flex items-center justify-center rounded-lg font-bold select-none',
              tileClasses,
            )}
            style={{ fontSize: getFontSize(value) }}
          >
            {value}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
