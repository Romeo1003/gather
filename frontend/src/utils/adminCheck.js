/**
 * Utility functions for checking admin permissions
 */

/**
 * Checks if a user has admin role
 * @param {Object} user - The user object from AuthContext
 * @returns {boolean} - True if user is an admin
 */
export const isAdmin = (user) => {
  if (!user) return false;
  return user.role === 'admin';
};

/**
 * Checks if current user has permission to perform an admin action
 * Useful for conditionally showing/hiding admin UI elements
 * 
 * @param {Object} user - The user object from AuthContext
 * @param {string} action - Optional specific action to check
 * @returns {boolean} - True if user can perform the action
 */
export const hasAdminPermission = (user, action = null) => {
  // Basic check - must be admin
  if (!isAdmin(user)) return false;
  
  // For future: could implement more granular permission checks based on action
  // e.g., some admins might only have access to specific actions
  
  return true;
}; 