// Portfolio and trading types
export interface Trade {
  id: string;
  userId: string;
  stock: string;
  market: string;
  action: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  profit: number;
  profitPercentage: number;
  createdAt: string;
}

export interface TradesResponse {
  data: Trade[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface TradesFilterParams {
  market?: 'INR' | 'USD' | 'all';
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface PortfolioPerformance {
  currentValue: number;
  totalProfit: number;
  totalProfitPercentage: number;
  winRate: number;
  winningTrades: number;
  losingTrades: number;
  totalTrades: number;
  initialInvestment: {
    INR: number;
    USD: number;
  };
}

export interface WatchlistItem {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  market: string;
  createdAt: string;
}

export interface WatchlistResponse {
  data: WatchlistItem[];
}

export interface AddToWatchlistRequest {
  symbol: string;
  name: string;
  market: string;
}
