class ApiError extends Error {
  status;
  errors;

  constructor(message, status, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError('User is not authorized', 401);
  }

  static BadRequest(message, errors = []) {
    return new ApiError(message, 400, errors);
  }

  static Internal(message) {
    return new ApiError(message, 500);
  }

  static Forbidden(message) {
    return new ApiError(message, 403);
  }

  static NotFound(message) {
    return new ApiError(message, 404);
  }
}

export default ApiError;