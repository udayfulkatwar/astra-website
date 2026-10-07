import { copyFileSync } from 'node:fs'

// GitHub Pages serves 404.html for paths that are not real files.
// The site is a single page with no router, so the app shell has to
// answer a refresh or a direct visit to any URL.
copyFileSync('dist/index.html', 'dist/404.html')
