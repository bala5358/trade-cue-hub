// Trading signals service
import { apiClient } from './api-client';
import {
  SignalsResponse,
  SignalStatistics,
  SignalsFilterParams,
} from '@/types/signals.types';

export class SignalsService {
  async getSignals(params: SignalsFilterParams = {}): Promise<SignalsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    if (params.market && params.market !== 'all') {
      queryParams.append('market', params.market);
    }
    if (params.action && params.action !== 'all') {
      queryParams.append('action', params.action);
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }

    const query = queryParams.toString();
    return apiClient.get<SignalsResponse>(`/signals${query ? `?${query}` : ''}`);
  }

  async getStatistics(): Promise<SignalStatistics> {
    return apiClient.get<SignalStatistics>('/signals/statistics');
  }
}

export const signalsService = new SignalsService();
