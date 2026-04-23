/**
 * Custom hook to handle permission checks for the current user.
 * @param {Object} currentUser - The currently logged-in user object.
 * @returns {Object} - Helper functions for permission validation.
 */
export function usePermissions(currentUser) {
  const hasPermission = (permission) => {
    if (!currentUser || !Array.isArray(currentUser.permissions)) return false;
    return currentUser.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    if (!permissions) return false;
    return permissions.some(p => hasPermission(p));
  };

  const hasAllPermissions = (permissions) => {
    if (!permissions) return false;
    return permissions.every(p => hasPermission(p));
  };

  return { hasPermission, hasAnyPermission, hasAllPermissions };
}
