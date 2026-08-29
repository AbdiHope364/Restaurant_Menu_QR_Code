import { menuApi } from '@ethio-buna/shared';

export const categoryService = {
  getAll: async () => {
    return await menuApi.getCategories();
  },
};

export default categoryService;
