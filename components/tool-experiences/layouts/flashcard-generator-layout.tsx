"use client"

import { useMemo, useState } from 'react'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import {
  educationLevels,
  learningModes,
  southAfricanLanguages,
  southAfricanSubjects,
} from '@/lib/context-options'

type Flashcard = {
  id: string
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  attempts: number
  correct: number
}

type Deck = {
  id: string
  name: string
  cards: Flashcard[]
  createdAt: Date
}

interface FlashcardGeneratorLayoutProps {
  tool: Tool
}

export function FlashcardGeneratorLayout({ tool }: FlashcardGeneratorLayoutProps) {
  const [mode, setMode] = useState<'create' | 'study'>('create')
  const [decks, setDecks] = useState<Deck[]>([
    {
      id: '1',
      name: 'Spanish Vocabulary',
      cards: [
        { id: '1', question: 'What is "hello" in Spanish?', answer: 'Hola', difficulty: 'easy', attempts: 0, correct: 0 },
        { id: '2', question: 'What is "thank you" in Spanish?', answer: 'Gracias', difficulty: 'easy', attempts: 0, correct: 0 },
      ],
      createdAt: new Date(),
    },
  ])
  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks[0]?.id || '')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [deckName, setDeckName] = useState('')
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [grade, setGrade] = useState('Grade 10')
  const [subject, setSubject] = useState('Mathematics')
  const [language, setLanguage] = useState('English')
  const [learningMode, setLearningMode] = useState('Quiz mode')

  const selectedDeck = decks.find((deck) => deck.id === selectedDeckId)
  const currentCard = selectedDeck?.cards[currentCardIndex]

  const studyStats = useMemo(() => {
    if (!selectedDeck) return { total: 0, correct: 0, percentage: 0, remaining: 0 }
    const total = selectedDeck.cards.length
    const correct = selectedDeck.cards.reduce((sum, card) => sum + card.correct, 0)
    const remaining = total - correct
    return { total, correct, percentage: total > 0 ? (correct / total) * 100 : 0, remaining }
  }, [selectedDeck])

  const addCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim() || !selectedDeckId) return
    setDecks((prev) => prev.map((deck) =>
      deck.id === selectedDeckId
        ? {
            ...deck,
            cards: [...deck.cards, { id: Date.now().toString(), question: newQuestion, answer: newAnswer, difficulty, attempts: 0, correct: 0 }],
          }
        : deck
    ))
    setNewQuestion('')
    setNewAnswer('')
  }

  const createDeck = () => {
    if (!deckName.trim()) return
    const newDeck: Deck = { id: Date.now().toString(), name: deckName, cards: [], createdAt: new Date() }
    setDecks([...decks, newDeck])
    setSelectedDeckId(newDeck.id)
    setDeckName('')
  }

  const nextCard = () => {
    if (!selectedDeck || selectedDeck.cards.length === 0) return
    setCurrentCardIndex(currentCardIndex < selectedDeck.cards.length - 1 ? currentCardIndex + 1 : 0)
    setIsFlipped(false)
  }

  const prevCard = () => {
    if (!selectedDeck || selectedDeck.cards.length === 0) return
    setCurrentCardIndex(currentCardIndex > 0 ? currentCardIndex - 1 : selectedDeck.cards.length - 1)
    setIsFlipped(false)
  }

  const markCard = (correct: boolean) => {
    if (!selectedDeck || !currentCard) return
    setDecks((prev) => prev.map((deck) =>
      deck.id === selectedDeckId
        ? {
            ...deck,
            cards: deck.cards.map((card) =>
              card.id === currentCard.id
                ? { ...card, attempts: card.attempts + 1, correct: correct ? card.correct + 1 : card.correct }
                : card
            ),
          }
        : deck
    ))
    nextCard()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="Student workspace"
        eyebrow="ST"
        statusTitle={`${subject} / ${grade}`}
        statusText={`Create CAPS-aware flashcards in ${language}, tuned for ${learningMode.toLowerCase()}.`}
      />

      <div className="mx-auto flex max-w-[1720px] justify-end gap-2 px-5 sm:px-8">
        <Button onClick={() => setMode('create')} variant={mode === 'create' ? 'default' : 'outline'} className="rounded-none">
          Create
        </Button>
        <Button onClick={() => setMode('study')} variant={mode === 'study' ? 'default' : 'outline'} className="rounded-none">
          Study
        </Button>
      </div>

      <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-none border border-border bg-white p-6 h-fit lg:sticky lg:top-44">
            <div className="mb-6 rounded-none border border-border bg-background p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">South African study context</p>
              <div className="grid gap-3">
                <select value={grade} onChange={(event) => setGrade(event.target.value)} className="rounded-none border border-border bg-white px-3 py-2 text-sm">
                  {educationLevels.map((level) => (
                    <option key={level}>{level}</option>
                  ))}
                </select>
                <select value={subject} onChange={(event) => setSubject(event.target.value)} className="rounded-none border border-border bg-white px-3 py-2 text-sm">
                  {southAfricanSubjects.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <select value={language} onChange={(event) => setLanguage(event.target.value)} className="rounded-none border border-border bg-white px-3 py-2 text-sm">
                  {southAfricanLanguages.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <select value={learningMode} onChange={(event) => setLearningMode(event.target.value)} className="rounded-none border border-border bg-white px-3 py-2 text-sm">
                  {learningModes.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Decks</p>
            <div className="mt-5 flex gap-2">
              <input value={deckName} onChange={(event) => setDeckName(event.target.value)} placeholder="New deck name" className="min-w-0 flex-1 rounded-none border border-border bg-white px-3 py-2 text-sm" />
              <Button onClick={createDeck} className="rounded-none px-3">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 grid gap-2">
              {decks.map((deck) => (
                <button
                  key={deck.id}
                  onClick={() => {
                    setSelectedDeckId(deck.id)
                    setCurrentCardIndex(0)
                    setIsFlipped(false)
                  }}
                  className={`rounded-none border p-3 text-left transition ${
                    selectedDeckId === deck.id ? 'border-foreground bg-foreground text-background' : 'border-border bg-white hover:border-foreground/30'
                  }`}
                >
                  <div className="text-sm font-semibold">{deck.name}</div>
                  <div className={selectedDeckId === deck.id ? 'mt-1 text-xs text-background/70' : 'mt-1 text-xs text-muted-foreground'}>{deck.cards.length} cards</div>
                </button>
              ))}
            </div>
          </aside>

          {mode === 'create' ? (
            <main className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <section className="rounded-none border border-border bg-white p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Add cards</p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">{selectedDeck?.name || 'Select a deck'}</h2>
                <div className="mt-6 grid gap-4">
                  <label className="grid gap-2 text-sm font-medium">
                    Question
                    <Textarea
                      value={newQuestion}
                      onChange={(event) => setNewQuestion(event.target.value)}
                      placeholder={`${grade} ${subject} question in ${language}...`}
                      className="min-h-28 resize-none rounded-none border border-border bg-muted p-4"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Answer
                    <Textarea
                      value={newAnswer}
                      onChange={(event) => setNewAnswer(event.target.value)}
                      placeholder={`CAPS-aligned answer or explanation for ${learningMode.toLowerCase()}...`}
                      className="min-h-28 resize-none rounded-none border border-border bg-muted p-4"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Difficulty
                    <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as any)} className="rounded-none border border-border bg-white px-3 py-2 text-sm">
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </label>
                  <Button onClick={addCard} disabled={!newQuestion.trim() || !newAnswer.trim()} className="rounded-none bg-primary text-primary-foreground">
                    Add card
                  </Button>
                </div>
              </section>

              <section className="rounded-none border border-border bg-white p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Cards</p>
                <div className="mt-5 grid gap-3">
                  {selectedDeck?.cards.map((card) => (
                    <div key={card.id} className="rounded-none border border-border bg-muted p-4 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{card.question}</p>
                          <p className="mt-1 text-muted-foreground">{card.answer}</p>
                        </div>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          ) : (
            <main className="space-y-6">
              <section className="rounded-none border border-border bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Progress</p>
                    <h2 className="mt-2 text-xl font-semibold text-foreground">{selectedDeck?.name || 'Select a deck'}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold">{Math.round(studyStats.percentage)}%</div>
                    <div className="text-xs text-muted-foreground">{studyStats.remaining} remaining</div>
                  </div>
                </div>
                <div className="mt-5 h-2 w-full overflow-hidden bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${studyStats.percentage}%` }} />
                </div>
              </section>

              <section className="rounded-none border border-border bg-white p-8">
                <button onClick={() => setIsFlipped(!isFlipped)} className="flex min-h-[300px] w-full items-center justify-center rounded-none border border-border bg-muted p-8 text-center">
                  <div>
                    <p className="mb-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">{isFlipped ? 'Answer' : 'Question'}</p>
                    <p className="text-2xl font-semibold leading-relaxed">{currentCard ? (isFlipped ? currentCard.answer : currentCard.question) : 'No cards in this deck yet'}</p>
                    <p className="mt-6 text-xs text-muted-foreground">Click to flip</p>
                  </div>
                </button>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <Button onClick={prevCard} variant="outline" className="rounded-none bg-white gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">{selectedDeck && selectedDeck.cards.length > 0 ? currentCardIndex + 1 : 0} / {selectedDeck?.cards.length || 0}</span>
                  <Button onClick={nextCard} variant="outline" className="rounded-none bg-white gap-2">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Button onClick={() => markCard(false)} variant="outline" disabled={!currentCard} className="rounded-none bg-white">
                    Need review
                  </Button>
                  <Button onClick={() => markCard(true)} disabled={!currentCard} className="rounded-none bg-primary text-primary-foreground">
                    Got it
                  </Button>
                </div>
              </section>
            </main>
          )}
        </div>
      </div>
    </motion.div>
  )
}
