interface InvoiceItem {
  description: string;
  quantity: number;
  price: number; // Now represents post-tax price
}

export const calculateTotals = (items: InvoiceItem[], taxRate: number) => {
  const taxMultiplier = 1 + (taxRate / 100);
  
  // Calculate totals from post-tax prices
  const total = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const subtotal = total / taxMultiplier;
  const tax = total - subtotal;

  return {
    subtotal,
    tax,
    total
  };
};

// Helper function to get pre-tax price
export const getPreTaxPrice = (postTaxPrice: number, taxRate: number): number => {
  const taxMultiplier = 1 + (taxRate / 100);
  return postTaxPrice / taxMultiplier;
};