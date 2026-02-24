/**
 * Converts cents (Integer) to a formatted decimal string (e.g., 2999 -> "29.99")
 */
export const formatCentsToDecimal = (cents: number): string => {
  return (cents / 100).toFixed(2);
};

/**
 * Returns the final active price, prioritizing sale_price if it exists
 */
export const getActivePrice = (price: number, salePrice?: number | null) => {
  const displayPrice = formatCentsToDecimal(price);
  const displaySalePrice = salePrice ? formatCentsToDecimal(salePrice) : null;
  
  return {
    original: displayPrice,
    sale: displaySalePrice,
    final: displaySalePrice || displayPrice,
  };
};