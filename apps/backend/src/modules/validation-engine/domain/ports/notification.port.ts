export interface NotificationPort {
  reportTechnicalError(error: Error, context?: Record<string, unknown>): Promise<void>;
}
