import { useState, useEffect, useCallback } from 'react';
import { 
  companiesAPI, 
  usersAPI, 
  documentsAPI, 
  auditAPI, 
  monitoringAPI, 
  securityAPI, 
  phishingAPI 
} from '../services/api';

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Companies hooks
export function useCompanies(params?: { page?: number; limit?: number; status?: string }) {
  return useApi(() => companiesAPI.getAll(params), [params]);
}

export function useCompany(id: string) {
  return useApi(() => companiesAPI.getById(id), [id]);
}

export function useCompanyStats() {
  return useApi(() => companiesAPI.getStats());
}

// Users hooks
export function useUsers(params?: { companyId?: string; page?: number; limit?: number }) {
  return useApi(() => usersAPI.getAll(params), [params]);
}

export function useUser(id: string) {
  return useApi(() => usersAPI.getById(id), [id]);
}

// Documents hooks
export function useDocuments(params?: {
  companyId?: string;
  securityLevel?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useApi(() => documentsAPI.getAll(params), [params]);
}

export function useDocument(id: string) {
  return useApi(() => documentsAPI.getById(id), [id]);
}

// Audit hooks
export function useAuditLogs(params?: {
  companyId?: string;
  action?: string;
  riskLevel?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  return useApi(() => auditAPI.getLogs(params), [params]);
}

export function useAuditStats(params?: { companyId?: string; days?: number }) {
  return useApi(() => auditAPI.getStats(params), [params]);
}

export function useRecentActivity(params?: { companyId?: string; limit?: number }) {
  return useApi(() => auditAPI.getRecentActivity(params), [params]);
}

export function useSecurityAlerts(params?: { companyId?: string; days?: number }) {
  return useApi(() => auditAPI.getSecurityAlerts(params), [params]);
}

// Monitoring hooks
export function useLiveActivity(limit?: number) {
  return useApi(() => monitoringAPI.getLiveActivity(limit), [limit]);
}

export function useMonitoringStats() {
  return useApi(() => monitoringAPI.getStats());
}

export function useActivityChart(params?: { days?: number; companyId?: string }) {
  return useApi(() => monitoringAPI.getActivityChart(params), [params]);
}

export function useTopUsers(params?: { companyId?: string; limit?: number }) {
  return useApi(() => monitoringAPI.getTopUsers(params), [params]);
}

export function usePerformanceMetrics() {
  return useApi(() => monitoringAPI.getPerformance());
}

// Security hooks
export function useSecuritySettings() {
  return useApi(() => securityAPI.getSettings());
}

export function useSecurityScore() {
  return useApi(() => securityAPI.getScore());
}

export function useSecurityReport() {
  return useApi(() => securityAPI.getReport());
}

// Phishing hooks
export function usePhishingCampaigns(params?: {
  companyId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useApi(() => phishingAPI.getCampaigns(params), [params]);
}

export function usePhishingCampaign(id: string) {
  return useApi(() => phishingAPI.getCampaignById(id), [id]);
}

export function usePhishingSimulations(campaignId: string, status?: string) {
  return useApi(() => phishingAPI.getSimulations(campaignId, status), [campaignId, status]);
}

export function useCampaignStats(id: string) {
  return useApi(() => phishingAPI.getCampaignStats(id), [id]);
}

export function useCompanyPhishingStats(companyId: string, days?: number) {
  return useApi(() => phishingAPI.getCompanyStats(companyId, days), [companyId, days]);
}

// Mutation hooks for create/update/delete operations
export function useMutation<T, P>(
  mutationFn: (params: P) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(params);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  return { mutate, loading, error };
}

// Specific mutation hooks
export function useCreateCompany() {
  return useMutation(companiesAPI.create);
}

export function useUpdateCompany() {
  return useMutation(({ id, data }: { id: string; data: any }) => 
    companiesAPI.update(id, data)
  );
}

export function useDeleteCompany() {
  return useMutation(companiesAPI.delete);
}

export function useCreateUser() {
  return useMutation(usersAPI.create);
}

export function useUpdateUser() {
  return useMutation(({ id, data }: { id: string; data: any }) => 
    usersAPI.update(id, data)
  );
}

export function useDeleteUser() {
  return useMutation(usersAPI.delete);
}

export function useUploadDocument() {
  return useMutation(documentsAPI.upload);
}

export function useUpdateDocument() {
  return useMutation(({ id, data }: { id: string; data: any }) => 
    documentsAPI.update(id, data)
  );
}

export function useDeleteDocument() {
  return useMutation(documentsAPI.delete);
}

export function useCreatePhishingCampaign() {
  return useMutation(phishingAPI.createCampaign);
}

export function useUpdatePhishingCampaign() {
  return useMutation(({ id, data }: { id: string; data: any }) => 
    phishingAPI.updateCampaign(id, data)
  );
}

export function useStartPhishingCampaign() {
  return useMutation(phishingAPI.startCampaign);
}

// Real-time data hook with polling
export function useRealTimeData<T>(
  apiCall: () => Promise<T>,
  interval: number = 5000, // 5 seconds default
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        setError(null);
        const result = await apiCall();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling
    intervalId = setInterval(fetchData, interval);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [interval, ...dependencies]);

  return { data, loading, error };
}

// Real-time monitoring hooks
export function useRealTimeActivity(interval?: number) {
  return useRealTimeData(() => monitoringAPI.getLiveActivity(20), interval);
}

export function useRealTimeStats(interval?: number) {
  return useRealTimeData(() => monitoringAPI.getStats(), interval);
}

export function useRealTimeAlerts(companyId?: string, interval?: number) {
  return useRealTimeData(() => auditAPI.getSecurityAlerts({ companyId }), interval, [companyId]);
}