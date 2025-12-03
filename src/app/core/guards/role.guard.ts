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
    router.navigate([ROUTES.AUTH.LOGIN]);
    return false;
  }

  // Get required roles from route data (check current route and parent route for lazy-loaded routes)
  let requiredRoles = route.data['roles'] as ApplicationRole[] | ApplicationRole | undefined;
  
  // If not found in current route, check parent route (for lazy-loaded routes)
  if (!requiredRoles && route.parent) {
    requiredRoles = route.parent.data['roles'] as ApplicationRole[] | ApplicationRole | undefined;
  }

  if (!requiredRoles) {
    // No role requirement, allow access
    return true;
  }

  // Get current user
  const currentUser = authService.currentUser();

  if (!currentUser) {
    router.navigate([ROUTES.AUTH.LOGIN]);
    return false;
  }

  // Check if user has required role
  const userRole = currentUser.Role;
  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  if (rolesArray.includes(userRole)) {
    return true;
  }

  // User doesn't have required role, redirect based on their actual role
  const roleRoutes: Record<ApplicationRole, string> = {
    [ApplicationRole.Admin]: '/admin/dashboard',
    [ApplicationRole.Teacher]: '/teacher/home',
    [ApplicationRole.Student]: '/student/hub',
  };

  const redirectPath = roleRoutes[userRole] || ROUTES.AUTH.LOGIN;
  router.navigate([redirectPath]);

  return false;
};

