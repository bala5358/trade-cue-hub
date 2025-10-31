// Trading signals types
export interface Signal {
  id: string;
  stock: string;
  action: 'BUY' | 'SELL';
  price: number;
  target: number;
  stopLoss: number;
  market: 'India' | 'US';
  status: 'active' | 'completed' | 'stopped';
  profit?: number;
  createdAt: string;
  completedAt?: string;
}

export interface SignalsResponse {
  data: Signal[];
  pagination: PaginationInfo;
}

export interface SignalStatistics {
  activeSignals: number;
  todayProfit: number;
  winRate: number;
  avgResponseTime: number;
  totalTrades: number;
}

export interface SignalsFilterParams {
  status?: 'active' | 'completed' | 'stopped' | 'all';
  market?: 'India' | 'US' | 'all';
  action?: 'BUY' | 'SELL' | 'all';
  page?: number;
  pageSize?: number;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
