import { useQuery, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '@ethio-buna/shared';

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await menuApi.getCategories();
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res)) return res;
      return [];
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const categories = Array.isArray(data) ? data : [];

  return {
    categories,
    loading: isLoading,

    createCategory: async (name) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });

      const previous = queryClient.getQueryData(['categories']) || [];
      const previousArray = Array.isArray(previous) ? previous : [];

      const temp = {
        id: 'cat-' + Date.now().toString(36),
        name,
      };

      queryClient.setQueryData(['categories'], [...previousArray, temp]);

      try {
        const res = await menuApi.createCategory(name);
        await queryClient.invalidateQueries({ queryKey: ['categories'] });
        return res;
      } catch (err) {
        queryClient.setQueryData(['categories'], previous);
        throw err;
      }
    },

    updateCategory: async ({ id, name }) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });

      const previous = queryClient.getQueryData(['categories']) || [];
      const previousArray = Array.isArray(previous) ? previous : [];

      queryClient.setQueryData(['categories'], (old = []) => {
        const arr = Array.isArray(old) ? old : [];
        return arr.map((c) => (c.id === id ? { ...c, name } : c));
      });

      try {
        const res = await menuApi.updateCategory(id, name);
        return res;
      } catch (err) {
        queryClient.setQueryData(['categories'], previous);
        throw err;
      }
    },

    deleteCategory: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });

      const previous = queryClient.getQueryData(['categories']) || [];
      const previousArray = Array.isArray(previous) ? previous : [];

      queryClient.setQueryData(
        ['categories'],
        previousArray.filter((c) => c.id !== id),
      );

      try {
        const res = await menuApi.deleteCategory(id);
        await queryClient.invalidateQueries({ queryKey: ['categories'] });
        return res;
      } catch (err) {
        queryClient.setQueryData(['categories'], previous);
        throw err;
      }
    },
  };
};

export default useCategories;
