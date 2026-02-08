import { createContext, useContext, useState, ReactNode } from 'react';

// Base currency is INR - all rates are relative to INR
export const currencies = [
  { id: 'INR', label: 'Indian Rupees (₹)', symbol: '₹', rate: 1 },
  { id: 'USD', label: 'US Dollars ($)', symbol: '$', rate: 0.012 },
  { id: 'EUR', label: 'Euro (€)', symbol: '€', rate: 0.011 },
  { id: 'GBP', label: 'Pounds (£)', symbol: '£', rate: 0.0095 },
  { id: 'JPY', label: 'Yen (¥)', symbol: '¥', rate: 1.80 },
  { id: 'AUD', label: 'Australian Dollars (A$)', symbol: 'A$', rate: 0.018 },
  { id: 'CHF', label: 'Swiss Francs (CHF)', symbol: 'CHF', rate: 0.011 },
];

interface CurrencyContextType {
  activeCurrency: string;
  setActiveCurrency: (currency: string) => void;
  selectedCurrency: typeof currencies[0];
  formatPrice: (priceInUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [activeCurrency, setActiveCurrency] = useState<string>('INR');

  const selectedCurrency = currencies.find(c => c.id === activeCurrency) || currencies[0];

  const formatPrice = (priceInUSD: number) => {
    const convertedPrice = priceInUSD * selectedCurrency.rate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: activeCurrency,
      minimumFractionDigits: activeCurrency === 'JPY' ? 0 : 2,
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider
      value={{
        activeCurrency,
        setActiveCurrency,
        selectedCurrency,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
