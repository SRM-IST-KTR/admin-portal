import { hasPermission, ROLES } from "./permissions";

/**
 * Utility function to check if user has permission to perform a specific action
 * 
 * @param {Object} user - The user object
 * @param {String} action - The action to check (e.g., 'create:event', 'edit:team', etc.)
 * @returns {Boolean} - Whether the user has permission
 */
export const checkActionPermission = (user, action) => {
    if (!user || !user.role) return false;

    // Admin has all permissions
    if (user.role === ROLES.ADMIN) return true;

    // Action-specific permissions for different roles
    const actionPermissions = {
        // Team management
        'view:teams': [ROLES.ADMIN, ROLES.MANAGER],
        'create:team': [ROLES.ADMIN],
        'edit:team': [ROLES.ADMIN, ROLES.MANAGER],
        'delete:team': [ROLES.ADMIN],

        // User management
        'view:users': [ROLES.ADMIN, ROLES.MANAGER],
        'approve:user': [ROLES.ADMIN],
        'revoke:user': [ROLES.ADMIN],

        // Events
        'view:events': [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER],
        'create:event': [ROLES.ADMIN, ROLES.MANAGER],
        'edit:event': [ROLES.ADMIN, ROLES.MANAGER],
        'delete:event': [ROLES.ADMIN],
        'register:event': [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER],

        // Recruitment
        'view:recruitment': [ROLES.ADMIN, ROLES.MANAGER],
        'manage:recruitment': [ROLES.ADMIN],

        // Logs
        'view:logs': [ROLES.ADMIN]
    };

    // Check if action exists and user's role is allowed
    const allowedRoles = actionPermissions[action];
    if (!allowedRoles) return false;

    return allowedRoles.includes(user.role);
};

/**
 * Hook-friendly utility to check route permissions
 * 
 * @param {Object} user - The user object
 * @param {String} route - The route to check
 * @returns {Boolean} - Whether the user has permission
 */
export const canAccessRoute = (user, route) => {
    return hasPermission(user, route);
};

export default {
    checkActionPermission,
    canAccessRoute
}; 