// Thrown by the service layer instead of `HTTPException` — keeps business
// logic Hono-agnostic. `middleware/error-handler.ts` maps these to responses.
export class DomainError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export class ConflictError extends DomainError {
  constructor(
    message: string,
    public fields: Record<string, string>,
  ) {
    super(message, 409);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class BadRequestError extends DomainError {
  constructor(message: string) {
    super(message, 400);
  }
}
