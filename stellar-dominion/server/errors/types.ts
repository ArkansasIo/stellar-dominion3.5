/**
 * Error Types and Definitions
 * Comprehensive error classification system for Stellar Dominion
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  // Auth Errors
  AUTH_INVALID_CREDENTIALS = 'auth/invalid-credentials',
  AUTH_SESSION_EXPIRED = 'auth/session-expired',
  AUTH_UNAUTHORIZED = 'auth/unauthorized',
  AUTH_FORBIDDEN = 'auth/forbidden',
  AUTH_MFA_FAILED = 'auth/mfa-failed',

  // Database Errors
  DB_CONNECTION_FAILED = 'db/connection-failed',
  DB_QUERY_FAILED = 'db/query-failed',
  DB_TRANSACTION_FAILED = 'db/transaction-failed',
  DB_CONSTRAINT_VIOLATION = 'db/constraint-violation',
  DB_TIMEOUT = 'db/timeout',

  // Validation Errors
  VALIDATION_INVALID_INPUT = 'validation/invalid-input',
  VALIDATION_MISSING_FIELD = 'validation/missing-field',
  VALIDATION_TYPE_MISMATCH = 'validation/type-mismatch',
  VALIDATION_RANGE_ERROR = 'validation/range-error',

  // Business Logic Errors
  BUSINESS_INSUFFICIENT_RESOURCES = 'business/insufficient-resources',
  BUSINESS_INVALID_STATE = 'business/invalid-state',
  BUSINESS_CONFLICT = 'business/conflict',
  BUSINESS_RATE_LIMITED = 'business/rate-limited',

  // System Errors
  SYSTEM_OUT_OF_MEMORY = 'system/out-of-memory',
  SYSTEM_CPU_OVERLOAD = 'system/cpu-overload',
  SYSTEM_DISK_FULL = 'system/disk-full',
  SYSTEM_NETWORK_ERROR = 'system/network-error',
  SYSTEM_TIMEOUT = 'system/timeout',

  // External Service Errors
  EXTERNAL_API_ERROR = 'external/api-error',
  EXTERNAL_SERVICE_UNAVAILABLE = 'external/service-unavailable',
  EXTERNAL_TIMEOUT = 'external/timeout',

  // Cache Errors
  CACHE_MISS = 'cache/miss',
  CACHE_INVALIDATION_FAILED = 'cache/invalidation-failed',
  CACHE_CORRUPTION = 'cache/corruption',

  // File System Errors
  FS_FILE_NOT_FOUND = 'fs/file-not-found',
  FS_PERMISSION_DENIED = 'fs/permission-denied',
  FS_IO_ERROR = 'fs/io-error',

  // Unknown
  UNKNOWN = 'unknown',
}

export interface ErrorDetails {
  id: string;
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  description?: string;
  timestamp: number;
  userId?: string;
  requestId?: string;
  statusCode: number;
  stack?: string;
  context?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ErrorReport {
  id: string;
  errors: ErrorDetails[];
  summary: {
    total: number;
    byCriticality: Record<string, number>;
    byCategory: Record<string, number>;
  };
  period: {
    startTime: number;
    endTime: number;
  };
  generatedAt: number;
}

export class AppError extends Error {
  public readonly id: string;
  public readonly code: string;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly statusCode: number;
  public readonly requestId?: string;
  public readonly context: Record<string, any>;
  public readonly metadata: Record<string, any>;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    statusCode: number = 500,
    context: Record<string, any> = {},
    metadata: Record<string, any> = {}
  ) {
    super(message);
    this.id = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.code = code;
    this.category = category;
    this.severity = severity;
    this.statusCode = statusCode;
    this.context = context;
    this.metadata = metadata;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON(): ErrorDetails {
    return {
      id: this.id,
      code: this.code,
      category: this.category,
      severity: this.severity,
      message: this.message,
      timestamp: Date.now(),
      requestId: this.requestId,
      statusCode: this.statusCode,
      stack: this.stack,
      context: this.context,
      metadata: this.metadata,
    };
  }
}
