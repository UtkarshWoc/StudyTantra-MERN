import { fsrs, generatorParameters, createEmptyCard, Rating, State } from 'ts-fsrs';

// FSRS (Free Spaced Repetition Scheduler): schedules each card's next review
// from how well it was recalled. Fuzz spreads due dates so reviews don't bunch up.
const scheduler = fsrs(generatorParameters({ enable_fuzz: true, request_retention: 0.9 }));

export const RATINGS = { again: Rating.Again, hard: Rating.Hard, good: Rating.Good, easy: Rating.Easy };
export { State };

/**
 * The FSRS card for a flashcard. Cards never reviewed start empty and are due
 * from the moment they were created.
 */
export const toFsrsCard = (flashcard) => {
  if (!flashcard.srs?.due) return createEmptyCard(flashcard.createdAt || new Date());
  const s = flashcard.srs;
  return {
    due: new Date(s.due),
    stability: s.stability,
    difficulty: s.difficulty,
    elapsed_days: s.elapsed_days,
    scheduled_days: s.scheduled_days,
    learning_steps: s.learning_steps ?? 0,
    reps: s.reps,
    lapses: s.lapses,
    state: s.state,
    last_review: s.last_review ? new Date(s.last_review) : undefined,
  };
};

export const isNewCard = (flashcard) => !flashcard.srs?.due || flashcard.srs.state === State.New;

/**
 * Apply a rating (1 Again, 2 Hard, 3 Good, 4 Easy). Returns the new SRS state.
 */
export const reviewCard = (flashcard, rating, now = new Date()) => {
  const { card } = scheduler.next(toFsrsCard(flashcard), now, rating);
  return { ...card, due: new Date(card.due), last_review: card.last_review ? new Date(card.last_review) : now };
};

/**
 * When the card would next be due for each possible rating, for showing
 * "Again <10m · Good 3d" on the buttons.
 */
export const previewIntervals = (flashcard, now = new Date()) => {
  const outcomes = scheduler.repeat(toFsrsCard(flashcard), now);
  return Object.fromEntries(
    [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy].map((r) => [r, new Date(outcomes[r].card.due).toISOString()])
  );
};
