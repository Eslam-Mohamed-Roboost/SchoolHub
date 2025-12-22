import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ValidationError,
  ValidationErrorException,
} from '../models/validation-error.model';

@Injectable({
  providedIn: 'root',
})
export class ValidationErrorService {
  /**
   * Check if error response contains validation errors
   */
  isValidationError(error: any): boolean {
    if (!error) return false;

    // Check if error.error is an array of validation errors
    if (Array.isArray(error.error)) {
      return error.error.every(
        (item: any) =>
          item &&
          typeof item === 'object' &&
          'PropertyName' in item &&
          'ErrorMessage' in item
      );
    }

    // Check if error.error has a validation errors array
    if (
      error.error &&
      typeof error.error === 'object' &&
      Array.isArray(error.error.errors)
    ) {
      return error.error.errors.every(
        (item: any) =>
          item &&
          typeof item === 'object' &&
          'PropertyName' in item &&
          'ErrorMessage' in item
      );
    }

    // Check if error.error itself is a validation error object
    if (
      error.error &&
      typeof error.error === 'object' &&
      'PropertyName' in error.error &&
      'ErrorMessage' in error.error
    ) {
      return true;
    }

    return false;
  }

  /**
   * Extract validation errors from error response
   */
  extractValidationErrors(error: any): ValidationError[] {
    if (!error) return [];

    // Direct array of validation errors
    if (Array.isArray(error.error)) {
      return error.error.map((item: any) => ({
        PropertyName: item.PropertyName || item.propertyName || '',
        ErrorMessage: item.ErrorMessage || item.errorMessage || '',
      }));
    }

    // Nested errors array
    if (
      error.error &&
      typeof error.error === 'object' &&
      Array.isArray(error.error.errors)
    ) {
      return error.error.errors.map((item: any) => ({
        PropertyName: item.PropertyName || item.propertyName || '',
        ErrorMessage: item.ErrorMessage || item.errorMessage || '',
      }));
    }

    // Single validation error object
    if (
      error.error &&
      typeof error.error === 'object' &&
      'PropertyName' in error.error &&
      'ErrorMessage' in error.error
    ) {
      return [
        {
          PropertyName:
            error.error.PropertyName || error.error.propertyName || '',
          ErrorMessage:
            error.error.ErrorMessage || error.error.errorMessage || '',
        },
      ];
    }

    return [];
  }

  /**
   * Create ValidationErrorException from error response
   */
  createValidationException(error: any): ValidationErrorException {
    const validationErrors = this.extractValidationErrors(error);
    const message = this.formatValidationErrors(validationErrors);
    return new ValidationErrorException(validationErrors, message);
  }

  /**
   * Format validation errors as a user-friendly message
   */
  formatValidationErrors(errors: ValidationError[]): string {
    if (errors.length === 0) return 'Validation failed';

    if (errors.length === 1) {
      return errors[0].ErrorMessage;
    }

    // Group by property and format
    const grouped = errors.reduce(
      (acc, error) => {
        if (!acc[error.PropertyName]) {
          acc[error.PropertyName] = [];
        }
        acc[error.PropertyName].push(error.ErrorMessage);
        return acc;
      },
      {} as Record<string, string[]>
    );

    const messages = Object.entries(grouped).map(([property, messages]) => {
      if (messages.length === 1) {
        return `${property}: ${messages[0]}`;
      }
      return `${property}: ${messages.join(', ')}`;
    });

    return messages.join('\n');
  }

  /**
   * Get field-specific error message
   */
  getFieldError(
    error: any,
    fieldName: string
  ): string | null {
    if (!this.isValidationError(error)) return null;

    const validationErrors = this.extractValidationErrors(error);
    const fieldErrors = validationErrors.filter(
      (err) =>
        err.PropertyName.toLowerCase() === fieldName.toLowerCase() ||
        err.PropertyName.toLowerCase() ===
          this.mapFieldName(fieldName).toLowerCase()
    );

    if (fieldErrors.length === 0) return null;
    return fieldErrors.map((err) => err.ErrorMessage).join(', ');
  }

  /**
   * Map common field names to API property names
   */
  private mapFieldName(fieldName: string): string {
    const mapping: Record<string, string> = {
      email: 'UserName',
      username: 'UserName',
      user_name: 'UserName',
      password: 'Password',
      confirmPassword: 'ConfirmPassword',
      confirm_password: 'ConfirmPassword',
    };

    return mapping[fieldName.toLowerCase()] || fieldName;
  }
}

