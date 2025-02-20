import { notify } from '../helpers/notify';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../services/api/categories';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type GetCategoriesQueryParams = {
  name?: string;
  column?: string;
  order?: 'asc' | 'desc';
  per_page?: number;
  category_id?: string;
  status?: string;
  page: number;
};

export function useCategories({
  name,
  column,
  order,
  per_page,
  page,
}: GetCategoriesQueryParams) {
  const queryClient = useQueryClient();

  const {
    data: categories = {
      data: [],
      meta: {
        total: 0,
        is_first_page: true,
        is_last_page: true,
        current_page: 1,
        next_page: 2,
        previous_page: 0,
      },
    },
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['categories', { name, column, order, per_page, page }],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => {
      notify('Erro ao criar a categoria', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => {
      notify('Erro ao atualizar a categoria', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => {
      notify('Erro ao excluir a categoria', 'error');
    },
  });

  const create = async (data: { name: string }) => {
    await createMutation.mutateAsync(data);
  };

  const update = async (data: { id: string; name: string }) => {
    await updateMutation.mutateAsync(data);
  };

  const deleteCategoryById = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return { categories, create, update, deleteCategoryById, isLoading, isError };
}
