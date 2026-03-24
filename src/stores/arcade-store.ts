import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_SCORES = 10

type ArcadeState = {
  highScores: Record<string, number[]>
  setHighScore: (game: string, score: number) => void
  getBestScore: (game: string) => number
}

export const useArcadeStore = create<ArcadeState>()(
  persist(
    (set, get) => ({
      highScores: {},
      setHighScore(game, score) {
        if (score === 0) return
        set((state) => {
          const current = state.highScores[game] ?? []
          const updated = [...current, score]
            .sort((a, b) => b - a)
            .slice(0, MAX_SCORES)
          return { highScores: { ...state.highScores, [game]: updated } }
        })
      },
      getBestScore(game) {
        const scores = get().highScores[game]
        return scores && scores.length > 0 ? (scores[0] ?? 0) : 0
      },
    }),
    { name: 'arcade-store' },
  ),
)
