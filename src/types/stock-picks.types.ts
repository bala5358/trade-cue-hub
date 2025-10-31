// Stock picks types
export interface StockPick {
  id: string;
  symbol: string;
  name: string;
  market: string;
  recommendation: 'Buy' | 'Sell' | 'Hold';
  targetPrice: number;
  currentPrice: number;
  potentialReturn: number;
  confidence: 'High' | 'Medium' | 'Low';
  reasoning: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockPicksResponse {
  data: StockPick[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  summary: {
    totalPicks: number;
    avgPotentialReturn: number;
    highConfidenceCount: number;
  };
}

export interface StockPicksFilterParams {
  recommendation?: 'Buy' | 'Sell' | 'Hold' | 'all';
  confidence?: 'High' | 'Medium' | 'Low' | 'all';
  page?: number;
  pageSize?: number;
}
