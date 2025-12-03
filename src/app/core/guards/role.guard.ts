import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { ApplicationRole } from '../enums/application-role.enum';
import { ROUTES } from '../../config/constants';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First check if user is authenticated
  if (!authService.isAuthenticated()) {
    console.warn('RoleGuard: User not authenticated');
    router.navigate([ROUTES.AUTH.LOGIN]);
    return false;
  }

  // Get required roles from route data
  // For lazy-loaded routes, the data is on the route that uses loadChildren
  let requiredRoles = route.data['roles'] as ApplicationRole[] | ApplicationRole | undefined;
  
  // If not found, walk up the route tree to find it
  if (!requiredRoles) {
    let currentRoute: ActivatedRouteSnapshot | null = route.parent;
    while (currentRoute && !requiredRoles) {
      requiredRoles = currentRoute.data['roles'] as ApplicationRole[] | ApplicationRole | undefined;
      currentRoute = currentRoute.parent;
    }
  }

  // Fallback: determine role from URL path if route data not found
  if (!requiredRoles) {
    const urlPath = route.pathFromRoot
      .map(r => r.routeConfig?.path)
      .filter(Boolean)
      .join('/');
    
    if (urlPath.startsWith('admin')) {
      requiredRoles = ApplicationRole.Admin;
    } else if (urlPath.startsWith('teacher')) {
      requiredRoles = ApplicationRole.Teacher;
    } else if (urlPath.startsWith('student')) {
      requiredRoles = ApplicationRole.Student;
    }
  }

  if (!requiredRoles) {
    // No role requirement, allow access
    console.warn('RoleGuard: No role requirement specified, allowing access');
    return true;
  }

  // Get current user - try from service first, then localStorage as fallback
  let currentUser = authService.currentUser();
  
  if (!currentUser) {
    // Fallback: try to load from localStorage
    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        // Create a temporary user object for role check
        currentUser = {
          ID: userData.ID || '',
          Name: userData.Name || '',
          Email: userData.Email || '',
          Role: userData.Role,
          PhoneNumber: userData.PhoneNumber || '',
          Authorization: userData.Authorization || '',
        };
      } catch (e) {
        console.error('RoleGuard: Error parsing user data from localStorage', e);
      }
    }
  }

  if (!currentUser || !currentUser.Role) {
    console.warn('RoleGuard: User authenticated but no user data or role available');
    router.navigate([ROUTES.AUTH.LOGIN]);
    return false;
  }

  // Check if user has required role
  const userRole = currentUser.Role;
  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  console.log('RoleGuard: Checking role', {
    userRole,
    requiredRoles: rolesArray,
    matches: rolesArray.includes(userRole),
    routePath: route.routeConfig?.path
  });

  if (rolesArray.includes(userRole)) {
    return true;
  }

  // User doesn't have required role, redirect based on their actual role
  const roleRoutes: Record<ApplicationRole, string> = {
    [ApplicationRole.Admin]: '/admin/dashboard',
    [ApplicationRole.Teacher]: '/teacher/dashboard',
    [ApplicationRole.Student]: '/student/hub',
  };

  const redirectPath = roleRoutes[userRole] || ROUTES.AUTH.LOGIN;
  console.warn('RoleGuard: User role does not match required role, redirecting to', redirectPath);
  router.navigate([redirectPath]);

  return false;
};

