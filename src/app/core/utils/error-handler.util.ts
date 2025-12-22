import { ValidationErrorException } from '../models/validation-error.model';

/**
 * Utility functions for handling errors in components
 */
export class ErrorHandlerUtil {
  /**
   * Extract field-specific error from ValidationErrorException
   */
  static getFieldError(
    error: any,
    fieldName: string
  ): string {
    if (error instanceof ValidationErrorException) {
      const errors = error.getErrorsForProperty(fieldName);
      return errors.join(', ') || '';
    }
    return '';
  }

  /**
   * Extract general error message (non-validation errors)
   */
  static getGeneralError(error: any): string {
    if (error instanceof ValidationErrorException) {
      // For validation errors, return empty string as they're field-specific
      return '';
    }
    return error?.message || 'An error occurred';
  }

  /**
   * Check if error is a ValidationErrorException
   */
  static isValidationError(error: any): error is ValidationErrorException {
    return error instanceof ValidationErrorException;
  }

  /**
   * Get all validation errors grouped by property
   */
  static getValidationErrors(
    error: any
  ): Record<string, string[]> | null {
    if (error instanceof ValidationErrorException) {
      return error.getErrorsByProperty();
    }
    return null;
  }
}

