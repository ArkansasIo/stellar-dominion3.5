class AnalyticsService {
  trackEvent(event: string, data?: any): void {
    console.log(`[Analytics] ${event}`, data);
  }
}

export const analyticsService = new AnalyticsService();
