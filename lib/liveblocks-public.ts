export function getLiveblocksPublishableKey() {
  const key = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLISHABLE_KEY?.trim()
  if (!key) {
    throw new Error('NEXT_PUBLIC_LIVEBLOCKS_PUBLISHABLE_KEY is not set')
  }
  return key
}
