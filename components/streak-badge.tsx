'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Trophy, Target } from 'lucide-react'
import { getStreakData, getAchievements, type StreakData, type Achievement } from '@/lib/gamification'

export function StreakBadge() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    setStreak(getStreakData())
    setAchievements(getAchievements())
  }, [])

  if (!streak || streak.currentStreak === 0) return null

  const unlocked = achievements.filter((a) => a.unlocked)
  const latest = unlocked[unlocked.length - 1]

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background shadow-lg transition hover:bg-foreground/90"
      >
        <Flame className="h-4 w-4 text-primary" />
        <span>{streak.currentStreak} day streak</span>
        {latest && (
          <span className="ml-1 text-lg leading-none">{latest.icon}</span>
        )}
      </motion.button>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-50 w-80 rounded-xl border border-border bg-white p-5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Your Progress</h3>
              <button onClick={() => setShowPanel(false)} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-lg bg-primary/5 p-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{streak.currentStreak} days</p>
                <p className="text-xs text-muted-foreground">Current streak</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-lg font-bold text-foreground">{streak.longestStreak}</p>
                <p className="text-xs text-muted-foreground">Best</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Achievements</p>
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                {achievements.slice(0, 6).map((ach) => (
                  <div
                    key={ach.id}
                    className={`flex items-center gap-3 rounded-md p-2 ${ach.unlocked ? 'bg-primary/5' : 'bg-muted/50'}`}
                  >
                    <span className="text-lg">{ach.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold ${ach.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {ach.title}
                      </p>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${(ach.progress / ach.target) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {ach.progress}/{ach.target}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
