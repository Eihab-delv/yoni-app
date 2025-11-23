import type { Role } from "./schemas";

export const actions = [
  'create',
  'read',
  'update',
  'delete',
  'invite',
  'publish',
  'redeem',
  '*', // Wildcard for all actions
] as const;
export type Action = (typeof actions)[number];

export type HTTPMethod = 'get' | 'post' | 'patch' | 'delete'
export type RouteActionMap = {
  method: HTTPMethod
  path: string
  action: Action
  resource: Resource
}

export const resources = [
  '*', // Wildcard for all resources
  'User',
  'Notification',
  'Image',
] as const;
export type Resource = (typeof resources)[number];

export type StrictPermission = {
  resource: Resource;
  actions: Action[];
};

export type RBAC = {
  [key in Role]: StrictPermission[];
};

export const rbac: RBAC = {
  guest: [
  ],
  member: [
    {
      resource: 'User',
      actions: ['read', 'update'], // Can view and update their own profile
    },
    {
      resource: 'Notification',
      actions: ['read'], // Can view notifications
    },
  ],
  admin: [
    {
      resource: 'Notification',
      actions: ['create', 'read', 'update', 'delete'], // Full notification management
    },
    {
      resource: 'User',
      actions: ['read'], // Can view member profiles
    },
  ],
  organizationAdmin: [
    {
      resource: '*',
      actions: ['*'], // Full access to all resources and actions
    },
  ],
};

/**
 * Checks if a user with a given role has permission to perform an action on a resource,
 * and optionally verifies ownership or context.
 *
 * @param role - The role of the user (e.g., 'guest', 'member', 'admin', 'organizationAdmin').
 * @param resource - The resource to check (e.g., 'User', 'Booking', 'Venue').
 * @param action - The action to check (e.g., 'create', 'read', 'update').
 * @param context - Additional context for ownership checks (e.g., user, venue).
 * @returns `true` if the user has permission and the context matches, otherwise `false`.
 */
export const hasPermission = (
  role: Role,
  resource: Resource,
  action: Action,
): boolean => {
  const permissions = rbac[role];

  // Check if the role has permission for the resource and action
  const hasBasePermission = permissions.some((permission) => {
    const resourceMatch = permission.resource === '*' || permission.resource === resource;
    const actionMatch = permission.actions.includes('*') || permission.actions.includes(action);
    return resourceMatch && actionMatch;
  });

  if (!hasBasePermission) {
    return false; // If the role doesn't have base permission, deny access
  }


  return true; // Allow if all checks pass
};

/**
 * Retrieves all permissions for a given role.
 *
 * @param role - The role to retrieve permissions for (e.g., 'free', 'standard', 'enterprise').
 * @returns An array of permissions for the role.
 */
export const getPermissionsForRole = (role: Role): StrictPermission[] => {
  return rbac[role];
};

/**
 * Checks if a role has access to all resources and actions (wildcard permissions).
 *
 * @param role - The role to check (e.g., 'free', 'standard', 'enterprise').
 * @returns `true` if the role has wildcard permissions, otherwise `false`.
 */
export const hasWildcardAccess = (role: Role): boolean => {
  const permissions = rbac[role];

  return permissions.some(
    (permission) => permission.resource === '*' && permission.actions.includes('*')
  );
};
