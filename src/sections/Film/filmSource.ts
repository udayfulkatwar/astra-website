/** Launch film files. The 1080p master is the founder's file, stored unchanged. */
export const FILM = {
  sectionId: 'astra-film',
  poster: '/media/film/astra-launch-film-poster.webp',
  master: '/media/film/astra-launch-film-1080p.mp4',
  compact: '/media/film/astra-launch-film-720p.mp4',
  /** Viewports at or below this width receive the 720p file. */
  compactMaxWidth: 900,
  label: 'ASTRA — Product Vision & Risk Architecture',
  disclosure:
    'Conceptual presentation. Illustrative interfaces and simulated data are shown. This film does not demonstrate verified live trading performance.',
} as const

/** Shown under the film when the demo link is public. The destination is a dashboard on simulated data. */
export const DEMO_SUPPORT = 'Explore the ASTRA dashboard and available product workflows.'

export const filmHref = `#${FILM.sectionId}`

export const compactMediaQuery = `(max-width: ${FILM.compactMaxWidth}px)`

export type FilmFile = '720' | '1080'

/**
 * Which encode to play.
 * A viewport at or below 900px, or a save-data connection, gets the 720p file.
 * Wider screens keep the master.
 */
export function chooseFilmFile(input: { width: number; saveData: boolean }): FilmFile {
  if (input.saveData || input.width <= FILM.compactMaxWidth) return '720'
  return '1080'
}

/** Network Information API. Absent or blocked means we do not assume save-data. */
export function readSaveData(): boolean {
  try {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    return connection?.saveData === true
  } catch {
    return false
  }
}
