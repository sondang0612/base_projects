class AppError extends Error {
  public statusCode: number;
  public status: string;
  public details: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };
