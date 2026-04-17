/**
 * Guest User Helper
 * Provides functions to work with guest users without authentication
 */

export interface GuestUser {
  id: string
  is_guest: true
  username: string
  email: string
  created_at: string
}

/**
 * Generate a guest user object for unauthenticated users
 * Uses localStorage to persist the same guest ID across sessions
 */
export function getOrCreateGuestUser(): GuestUser {
  const guestKey = 'witara_guest_user_id'
  let guestId = localStorage.getItem(guestKey)

  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(guestKey, guestId)
  }

  return {
    id: guestId,
    is_guest: true,
    username: 'Tamu',
    email: `${guestId}@guest.witara.local`,
    created_at: new Date().toISOString()
  }
}

/**
 * Check if a user object is a guest user
 */
export function isGuestUser(user: any): boolean {
  return user?.is_guest === true
}

/**
 * Get user ID, whether from real auth or guest
 */
export function getUserId(user: any): string {
  if (!user) return getOrCreateGuestUser().id
  return user.id
}

/**
 * Get username, whether from real auth or guest
 */
export function getUsername(user: any, profile?: any): string {
  if (user?.is_guest) {
    return 'Tamu'
  }
  if (profile?.username) {
    return profile.username
  }
  return user?.email?.split('@')[0] || 'Pengguna'
}

/**
 * Determine if user can perform actions (real auth or guest)
 */
export function canUserPerformActions(user: any): boolean {
  return !!user && (user.id || user.is_guest)
}
