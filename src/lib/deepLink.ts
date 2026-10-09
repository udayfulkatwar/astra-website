/**
 * The id in a location hash, when the hash is a single element id.
 * Empty hashes and anything that is not an id return null.
 */
export function hashId(hash: string): string | null {
  if (!hash.startsWith('#') || hash.length < 2) return null
  let id = hash.slice(1)
  try {
    id = decodeURIComponent(id)
  } catch {
    return null
  }
  if (!/^[A-Za-z][\w-]*$/.test(id)) return null
  return id
}

/** `#id` when that id is on the page. Otherwise null, so a bare visit stays at the top. */
export function deepLinkSelector(hash: string, exists: (id: string) => boolean): string | null {
  const id = hashId(hash)
  if (!id || !exists(id)) return null
  return `#${id}`
}

/**
 * Where the browser Back button should land. A hash that names a real section
 * scrolls there. Anything else is the top (0), which is also how leaving the
 * film returns home when the previous address has no section.
 */
export function hashScrollTarget(hash: string, exists: (id: string) => boolean): string | 0 {
  return deepLinkSelector(hash, exists) ?? 0
}
