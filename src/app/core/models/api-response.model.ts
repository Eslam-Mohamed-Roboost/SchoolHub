export interface ApiResponse<T> {
  Data: T;
  IsSuccess: boolean;
  Message: string;
  ErrorCode: string;
  IsAuthorized: boolean;
}
