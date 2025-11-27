import api from './api';

const USER_KEY = 'instant_voices_user';

/**
 * Sign in user anonymously (Guest)
 * @returns {Promise<Object>} User object
 */
export const signInUser = async () => {
  try {
    const response = await api.post('/auth/guest');
    const user = { uid: response.data.userId, isAnonymous: true };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

/**
 * Get current user
 * @returns {Object|null} Current user or null
 */
export const getCurrentUser = () => {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

/**
 * Sign out user
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const onAuthChange = (callback) => {
  const user = getCurrentUser();
  // Call immediately with current state
  callback(user);
  
  // In a real app, we might listen to storage events or custom events
  // For now, this is sufficient as we don't have multi-tab sync requirements yet
  return () => {};
};
