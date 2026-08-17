/**
 * DriftCore — Analytics Service Abstraction
 */

export interface IAnalyticsService {
  logEvent(eventName: string, params?: Record<string, any>): void;
  logScreenView(screenName: string): void;
}

class MockAnalyticsService implements IAnalyticsService {
  logEvent(eventName: string, params?: Record<string, any>): void {
    console.log(`[AnalyticsService] Event: ${eventName}`, params ?? '');
  }

  logScreenView(screenName: string): void {
    console.log(`[AnalyticsService] Screen View: ${screenName}`);
  }
}

export const analyticsService = new MockAnalyticsService();
