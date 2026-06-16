import { DEPARTMENTS, MANAGEMENT_VIEW_PERMISSIONS } from '../constants';

/**
 * Resolves the permissions a user effectively has at runtime.
 * Service department users automatically inherit management overview access.
 */
export function getEffectivePermissions(user) {
  if (!user?.permissions) return [];

  const effective = new Set(user.permissions);

  if (user.department === DEPARTMENTS.SERVICE) {
    MANAGEMENT_VIEW_PERMISSIONS.forEach((permission) => effective.add(permission));
  }

  return [...effective];
}
