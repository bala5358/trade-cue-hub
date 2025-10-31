// Portfolio service
import { apiClient } from './api-client';
import {
  TradesResponse,
  TradesFilterParams,
  PortfolioPerformance,
  WatchlistResponse,
  AddToWatchlistRequest,
  WatchlistItem,
} from '@/types/portfolio.types';

export class PortfolioService {
  async getTrades(params: TradesFilterParams = {}): Promise<TradesResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.market && params.market !== 'all') {
      queryParams.append('market', params.market);
    }
    if (params.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }

    const query = queryParams.toString();
    return apiClient.get<TradesResponse>(`/portfolio/trades${query ? `?${query}` : ''}`);
  }

  async getPerformance(): Promise<PortfolioPerformance> {
    return apiClient.get<PortfolioPerformance>('/portfolio/performance');
  }

  async getWatchlist(): Promise<WatchlistResponse> {
    return apiClient.get<WatchlistResponse>('/portfolio/watchlist');
  }

  async addToWatchlist(data: AddToWatchlistRequest): Promise<{ success: boolean; watchlistItem: WatchlistItem }> {
    return apiClient.post('/portfolio/watchlist', data);
  }

  async removeFromWatchlist(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/portfolio/watchlist/${id}`);
  }
}

export const portfolioService = new PortfolioService();
