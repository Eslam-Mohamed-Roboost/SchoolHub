/**
 * Validation error model from API
 */
export interface ValidationError {
  PropertyName: string;
  ErrorMessage: string;
}

/**
 * Extended error class for validation errors
 */
export class ValidationErrorException extends Error {
  constructor(
    public readonly validationErrors: ValidationError[],
    message?: string
  ) {
    super(message || 'Validation failed');
    this.name = 'ValidationErrorException';
    Object.setPrototypeOf(this, ValidationErrorException.prototype);
  }

  /**
   * Get errors for a specific property
   */
  getErrorsForProperty(propertyName: string): string[] {
    return this.validationErrors
      .filter((error) => error.PropertyName === propertyName)
      .map((error) => error.ErrorMessage);
  }

  /**
   * Get all error messages as a single string
   */
  getAllMessages(): string {
    return this.validationErrors.map((error) => error.ErrorMessage).join(', ');
  }

  /**
   * Get errors grouped by property name
   */
  getErrorsByProperty(): Record<string, string[]> {
    const grouped: Record<string, string[]> = {};
    this.validationErrors.forEach((error) => {
      if (!grouped[error.PropertyName]) {
        grouped[error.PropertyName] = [];
      }
      grouped[error.PropertyName].push(error.ErrorMessage);
    });
    return grouped;
  }

  /**
   * Check if there are errors for a specific property
   */
  hasErrorForProperty(propertyName: string): boolean {
    return this.validationErrors.some(
      (error) => error.PropertyName === propertyName
    );
  }
}

