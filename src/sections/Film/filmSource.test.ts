import assert from 'node:assert/strict'
import { test } from 'node:test'
import { FILM, chooseFilmFile, compactMediaQuery, DEMO_SUPPORT, filmHref } from './filmSource.ts'

test('wide screens keep the master unless save-data is on', () => {
  assert.equal(chooseFilmFile({ width: 901, saveData: false }), '1080')
  assert.equal(chooseFilmFile({ width: 1440, saveData: false }), '1080')
  assert.equal(chooseFilmFile({ width: 1920, saveData: false }), '1080')
  assert.equal(chooseFilmFile({ width: 1920, saveData: true }), '720')
  assert.equal(chooseFilmFile({ width: 901, saveData: true }), '720')
})

test('viewports up to 900px get the 720p file', () => {
  assert.equal(FILM.compactMaxWidth, 900)
  assert.equal(compactMediaQuery, '(max-width: 900px)')
  assert.equal(chooseFilmFile({ width: 900, saveData: false }), '720')
  assert.equal(chooseFilmFile({ width: 320, saveData: false }), '720')
  assert.equal(chooseFilmFile({ width: 0, saveData: false }), '720')
})

test('the film anchor and the disclosure stay exact', () => {
  assert.equal(filmHref, '#astra-film')
  assert.equal(
    FILM.disclosure,
    'Conceptual presentation. Illustrative interfaces and simulated data are shown. This film does not demonstrate verified live trading performance.',
  )
  assert.equal(FILM.label, 'ASTRA — Product Vision & Risk Architecture')
  assert.equal(FILM.master, '/media/film/astra-launch-film-1080p.mp4')
  assert.equal(FILM.compact, '/media/film/astra-launch-film-720p.mp4')
  assert.equal(DEMO_SUPPORT, 'Explore an interactive ASTRA demo running on simulated data.')
})
