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

/** HTMLMediaElement.NETWORK_NO_SOURCE. Every candidate was rejected. */
const NETWORK_NO_SOURCE = 3
/** MediaError.MEDIA_ERR_ABORTED. A preload that was cancelled is not a failure. */
const MEDIA_ERR_ABORTED = 1

/**
 * Whether the visible “could not be loaded” line should appear.
 * Pass the video element’s own error and networkState. A source the browser
 * skips fires error while that video is still idle and has no error. An
 * aborted preload is not a failure. The line appears when the video reports
 * an error, or when no source is left.
 */
export function filmPlaybackFailed(input: { errorCode: number | null; networkState: number }): boolean {
  if (input.errorCode === MEDIA_ERR_ABORTED) return false
  if (input.errorCode != null) return true
  return input.networkState === NETWORK_NO_SOURCE
}

/** True when this browser can decode the film’s H.264 file. */
export function browserCanPlayFilm(): boolean {
  try {
    const video = document.createElement('video')
    return video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') !== ''
  } catch {
    return false
  }
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
