/**
 * DriftCore — In-App Purchase Service Abstraction
 */

export interface IIAPService {
  purchaseProduct(productId: string): Promise<boolean>;
  restorePurchases(): Promise<boolean>;
}

class MockIAPService implements IIAPService {
  async purchaseProduct(productId: string): Promise<boolean> {
    console.log(`[IAPService] Purchasing product stub: ${productId}`);
    return true;
  }

  async restorePurchases(): Promise<boolean> {
    console.log('[IAPService] Restoring purchases stub');
    return true;
  }
}

export const iapService = new MockIAPService();
