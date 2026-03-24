import { useRef } from 'react'
import type { Direction } from '#/lib/game-2048'

type SwipeHandlers = {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseUp: (e: React.MouseEvent) => void
}

export function useSwipeDirection(
  onSwipe: (dir: Direction) => void,
  threshold = 30,
): SwipeHandlers {
  const start = useRef<{ x: number; y: number } | null>(null)

  function resolve(dx: number, dy: number) {
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return
    if (Math.abs(dx) >= Math.abs(dy)) {
      onSwipe(dx > 0 ? 'right' : 'left')
    } else {
      onSwipe(dy > 0 ? 'down' : 'up')
    }
  }

  return {
    onTouchStart(e) {
      const t = e.touches[0]
      if (t) start.current = { x: t.clientX, y: t.clientY }
    },
    onTouchEnd(e) {
      if (!start.current) return
      const t = e.changedTouches[0]
      if (!t) return
      resolve(t.clientX - start.current.x, t.clientY - start.current.y)
      start.current = null
    },
    onMouseDown(e) {
      start.current = { x: e.clientX, y: e.clientY }
    },
    onMouseUp(e) {
      if (!start.current) return
      resolve(e.clientX - start.current.x, e.clientY - start.current.y)
      start.current = null
    },
  }
}
