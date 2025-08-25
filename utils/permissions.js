// PERMISSION DEFINITIONS FOR ROUTES
// This file contains hard-coded permissions for different user roles
// Each route is mapped to the roles that can access it

// Define all available roles
const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    MEMBER: 'member'
};

// Frontend route permissions
const FRONTEND_PERMISSIONS = {
    // Dashboard/main pages
    '/dashboard': [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER],
    '/profile': [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER],
    '/change-password': [ROLES.MANAGER, ROLES.MEMBER],

    // Admin-only pages
    '/users/pending': [ROLES.ADMIN],
    '/users/pending-new': [ROLES.ADMIN],
    '/logs': [ROLES.ADMIN],

    // Admin and manager pages
    '/teams': [ROLES.ADMIN, ROLES.MANAGER],

    // Events pages
    '/events': [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER],
    '/events/[slug]': [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER],

    // Recruitment pages
    '/recruitment': [ROLES.ADMIN, ROLES.MANAGER],
};

// API route permissions
const API_PERMISSIONS = {
    // User management
    '/api/v1/users/all': [ROLES.ADMIN],
    '/api/v1/users/approved': [ROLES.ADMIN, ROLES.MANAGER],
    '/api/v1/users/pending': [ROLES.ADMIN],
    '/api/v1/users/approve': [ROLES.ADMIN],
    '/api/v1/users/revoke': [ROLES.ADMIN],
    '/api/v1/users/profile': [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER],

    // Auth logs
    '/api/v1/auth/logs': [ROLES.ADMIN],

    // Teams
    '/api/v1/teams': [ROLES.ADMIN, ROLES.MANAGER],

    // Events
    '/api/v1/events': [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER],

    // Recruitment
    '/api/v1/recruitment': [ROLES.ADMIN, ROLES.MANAGER],
};

// Helper function to check if a user has permission for a specific route
const hasPermission = (user, route, isApi = false) => {
    if (!user || !user.role) return false;

    const permissions = isApi ? API_PERMISSIONS : FRONTEND_PERMISSIONS;

    // Admins have access to everything
    if (user.role === ROLES.ADMIN) return true;

    // Check if route exists in permissions and if user's role is allowed
    const allowedRoles = permissions[route];
    if (!allowedRoles) return false;

    return allowedRoles.includes(user.role);
};

export {
    ROLES,
    FRONTEND_PERMISSIONS,
    API_PERMISSIONS,
    hasPermission
}; 