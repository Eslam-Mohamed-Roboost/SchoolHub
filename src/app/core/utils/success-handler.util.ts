/**
 * Utility functions for handling successful API responses
 * When IsSuccess: true, validation errors should be cleared
 */
export class SuccessHandlerUtil {
  /**
   * Clear all validation errors from component error signals
   * Call this in the 'next' callback of subscribe when IsSuccess: true
   */
  static clearAllErrors(clearFunctions: Array<() => void>): void {
    clearFunctions.forEach((clearFn) => clearFn());
  }

  /**
   * Create a standardized success handler that clears errors and resets form
   */
  static createSuccessHandler<T>(
    clearErrorsFn: () => void,
    onSuccess?: (data: T) => void
  ): (data: T) => void {
    return (data: T) => {
      // Always clear errors on success
      clearErrorsFn();
      // Call custom success handler if provided
      if (onSuccess) {
        onSuccess(data);
      }
    };
  }
}

