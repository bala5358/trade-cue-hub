// Stock picks service
import { apiClient } from './api-client';
import {
  StockPicksResponse,
  StockPicksFilterParams,
} from '@/types/stock-picks.types';

export class StockPicksService {
  async getStockPicks(params: StockPicksFilterParams = {}): Promise<StockPicksResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.recommendation && params.recommendation !== 'all') {
      queryParams.append('recommendation', params.recommendation);
    }
    if (params.confidence && params.confidence !== 'all') {
      queryParams.append('confidence', params.confidence);
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }

    const query = queryParams.toString();
    return apiClient.get<StockPicksResponse>(`/stock-picks${query ? `?${query}` : ''}`);
  }
}

export const stockPicksService = new StockPicksService();
