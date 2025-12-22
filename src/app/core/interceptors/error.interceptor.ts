import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ROUTES } from '../../config/constants';
import { ValidationErrorService } from '../services/validation-error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const validationErrorService = inject(ValidationErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if this is a validation error
      if (validationErrorService.isValidationError(error)) {
        const validationException =
          validationErrorService.createValidationException(error);
        console.error('Validation Error:', {
          status: error.status,
          url: req.url,
          validationErrors: validationException.validationErrors,
        });
        return throwError(() => validationException);
      }

      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Bad Request';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please login again.';
            router.navigate([ROUTES.AUTH.LOGIN]);
            break;
          case 403:
            errorMessage = 'Access denied';
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 500:
            errorMessage = 'Internal server error';
            break;
          default:
            errorMessage = `Server Error: ${error.status}`;
        }
      }

      // Log error to console (in production, send to error tracking service)
      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
        error: error.error,
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};
