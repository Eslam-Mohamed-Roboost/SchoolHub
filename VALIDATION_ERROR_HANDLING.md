# Validation Error Handling Guide

This guide explains how to handle API validation errors across all endpoints in the School Hub application.

## Overview

The application now includes a comprehensive validation error handling system that:
- Automatically detects validation errors from the API
- Parses validation error arrays with `PropertyName` and `ErrorMessage`
- Displays field-specific errors next to form inputs
- Provides reusable utilities for consistent error handling

## API Error Format

The API returns validation errors in the following format:

```json
[
  {
    "PropertyName": "UserName",
    "ErrorMessage": "Username is required"
  },
  {
    "PropertyName": "UserName",
    "ErrorMessage": "Username must be at least 3 characters"
  },
  {
    "PropertyName": "Password",
    "ErrorMessage": "Password is required"
  },
  {
    "PropertyName": "Password",
    "ErrorMessage": "Password must be at least 6 characters"
  }
]
```

## Architecture

### 1. Models (`core/models/validation-error.model.ts`)

- `ValidationError`: Interface for API validation errors
- `ValidationErrorException`: Custom error class with helper methods

### 2. Services (`core/services/validation-error.service.ts`)

- `ValidationErrorService`: Service for detecting and parsing validation errors

### 3. Interceptors (`core/interceptors/error.interceptor.ts`)

- Automatically detects validation errors and converts them to `ValidationErrorException`

### 4. Base Service (`core/services/base-http.service.ts`)

- Handles validation errors in all HTTP requests

### 5. Utilities (`core/utils/error-handler.util.ts`)

- Helper functions for components to extract error messages

## Usage in Components

### Basic Example

```typescript
import { Component, signal } from '@angular/core';
import { ValidationErrorException } from '../../../../core/models/validation-error.model';
import { ErrorHandlerUtil } from '../../../../core/utils/error-handler.util';

@Component({
  // ...
})
export class MyComponent {
  email = signal('');
  password = signal('');
  emailError = signal('');
  passwordError = signal('');
  generalError = signal('');

  constructor(private myService: MyService) {}

  onSubmit() {
    // Clear previous errors
    this.emailError.set('');
    this.passwordError.set('');
    this.generalError.set('');

    const data = {
      email: this.email(),
      password: this.password(),
    };

    this.myService.create(data).subscribe({
      next: (response) => {
        // IMPORTANT: When IsSuccess: true, always clear validation errors
        this.clearErrors();
        // Handle success (reset form, show message, navigate, etc.)
      },
      error: (error) => {
        // Handle validation errors
        if (error instanceof ValidationErrorException) {
          // Extract field-specific errors
          this.emailError.set(
            ErrorHandlerUtil.getFieldError(error, 'Email') ||
            ErrorHandlerUtil.getFieldError(error, 'UserName')
          );
          this.passwordError.set(
            ErrorHandlerUtil.getFieldError(error, 'Password')
          );

          // Check for other validation errors
          const otherErrors = error.validationErrors.filter(
            (err) =>
              err.PropertyName !== 'Email' &&
              err.PropertyName !== 'UserName' &&
              err.PropertyName !== 'Password'
          );
          if (otherErrors.length > 0) {
            this.generalError.set(
              otherErrors.map((err) => err.ErrorMessage).join(', ')
            );
          }
        } else {
          // Handle other types of errors
          this.generalError.set(
            ErrorHandlerUtil.getGeneralError(error)
          );
        }
      },
    });
  }
}
```

### Template Example

```html
<form (ngSubmit)="onSubmit()">
  <!-- Email Field -->
  <div class="mb-3">
    <div class="form-floating">
      <input
        type="email"
        class="form-control rounded-3"
        [class.is-invalid]="emailError()"
        id="email"
        [(ngModel)]="email"
        name="email"
        required
      >
      <label for="email">Email address</label>
    </div>
    @if (emailError()) {
      <div class="invalid-feedback d-block small text-start mt-1">
        {{ emailError() }}
      </div>
    }
  </div>

  <!-- Password Field -->
  <div class="mb-3">
    <div class="form-floating">
      <input
        type="password"
        class="form-control rounded-3"
        [class.is-invalid]="passwordError()"
        id="password"
        [(ngModel)]="password"
        name="password"
        required
      >
      <label for="password">Password</label>
    </div>
    @if (passwordError()) {
      <div class="invalid-feedback d-block small text-start mt-1">
        {{ passwordError() }}
      </div>
    }
  </div>

  <!-- General Error Message -->
  @if (generalError()) {
    <div class="alert alert-danger small mb-3">
      {{ generalError() }}
    </div>
  }

  <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

## Using ValidationErrorService Directly

If you need more control, you can use `ValidationErrorService` directly:

```typescript
import { ValidationErrorService } from '../../../../core/services/validation-error.service';

constructor(
  private myService: MyService,
  private validationErrorService: ValidationErrorService
) {}

onSubmit() {
  this.myService.create(data).subscribe({
    error: (error) => {
      if (this.validationErrorService.isValidationError(error)) {
        const emailError = this.validationErrorService.getFieldError(
          error,
          'email'
        );
        // Handle error...
      }
    },
  });
}
```

## Field Name Mapping

The `ValidationErrorService` automatically maps common field names:
- `email` → `UserName`
- `username` → `UserName`
- `user_name` → `UserName`
- `password` → `Password`
- `confirmPassword` → `ConfirmPassword`

## ValidationErrorException Methods

```typescript
// Get errors for a specific property
const emailErrors = error.getErrorsForProperty('UserName');

// Get all error messages as a single string
const allMessages = error.getAllMessages();

// Get errors grouped by property name
const groupedErrors = error.getErrorsByProperty();

// Check if there are errors for a property
const hasEmailError = error.hasErrorForProperty('UserName');
```

## Best Practices

1. **Always clear errors before submitting**: Reset error signals before making API calls
2. **Always clear errors on success**: When `IsSuccess: true`, clear all validation errors in the `next` callback
3. **Use field-specific errors**: Display validation errors next to the relevant input fields
4. **Handle both validation and general errors**: Some errors may not be validation-related
5. **Map field names correctly**: Use the correct API property names (e.g., `UserName` vs `email`)
6. **Provide user-friendly messages**: The API error messages should already be user-friendly, but you can enhance them if needed

## Success Response Handling

When the API returns `IsSuccess: true`, it means the operation was successful. You **MUST** clear all validation errors:

```typescript
this.myService.create(data).subscribe({
  next: (response) => {
    // Clear all validation errors when IsSuccess: true
    this.clearErrors();
    
    // Then handle success (reset form, show message, etc.)
    this.myForm.reset();
    alert('Operation successful!');
  },
  error: (error) => {
    // Handle errors (validation or other)
    this.handleError(error);
  },
});
```

The `BaseHttpService` automatically extracts `response.Data` when `IsSuccess: true`, so your `next` callback receives the data directly.

## Example: Complete Form Component

See `src/app/features/auth/pages/login/login-page.component.ts` for a complete implementation example.

## Testing

To test validation error handling:

1. Submit a form with invalid data
2. The API should return validation errors in the expected format
3. Errors should appear next to the relevant form fields
4. General errors (if any) should appear at the top of the form

## Troubleshooting

### Errors not displaying

- Check that the error format matches the expected structure
- Verify that `ValidationErrorException` is being thrown
- Ensure error signals are being set in the component

### Wrong field names

- Check the API response to see the exact `PropertyName` values
- Update field name mappings in `ValidationErrorService` if needed
- Use `ErrorHandlerUtil.getFieldError()` with the correct property name

### Multiple errors for same field

- The system automatically joins multiple errors with commas
- You can customize the display format if needed

