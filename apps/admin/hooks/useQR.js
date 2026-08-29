import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { qrService } from '../src/services/qrService';

export const useQR = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['qr-list'],
    queryFn: async () => {
      const res = await qrService.getAll();
      const data = res?.data ?? res;

      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      return [];
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['qr-list'] });
    };
    window.addEventListener('qr_list_updated', handleUpdate);
    return () => {
      window.removeEventListener('qr_list_updated', handleUpdate);
    };
  }, [queryClient]);

  return {
    qrs: Array.isArray(query.data) ? query.data : [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useQR;
