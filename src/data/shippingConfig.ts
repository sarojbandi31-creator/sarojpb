// Shipping Configuration
export const SHIPPING_CONFIG = {
  // Default shipping cost in INR
  defaultCost: import.meta.env.VITE_SHIPPING_COST ? Number(import.meta.env.VITE_SHIPPING_COST) : 0,
  
  // Minimum order value for free shipping (0 = free shipping always disabled)
  freeShippingThreshold: import.meta.env.VITE_FREE_SHIPPING_THRESHOLD ? Number(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD) : 0,
  
  // Currency
  currency: 'INR',
  
  // Display shipping cost in UI
  displayShipping: true,
};

/**
 * Calculate shipping cost based on order total
 * @param orderTotal - Total order amount in INR
 * @returns Shipping cost in INR
 */
export function calculateShippingCost(orderTotal: number): number {
  // If order exceeds free shipping threshold, shipping is free
  if (SHIPPING_CONFIG.freeShippingThreshold > 0 && orderTotal >= SHIPPING_CONFIG.freeShippingThreshold) {
    return 0;
  }
  
  return SHIPPING_CONFIG.defaultCost;
}

/**
 * Format shipping cost for display
 * @param cost - Shipping cost in INR
 * @returns Formatted string (e.g., "Free" or "₹100")
 */
export function formatShippingCost(cost: number): string {
  if (cost === 0) {
    return 'Free';
  }
  
  return `₹${cost.toFixed(0)}`;
}
