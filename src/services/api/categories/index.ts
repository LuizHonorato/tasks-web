import { AxiosError } from 'axios';
import api from '../../api';
import { notify } from '../../../helpers/notify';

export type Category = {
  id: string;
  name: string;
  updated_at: string;
};

export type PaginatedCategories = {
  data: Category[];
  meta: {
    total: number;
    is_first_page: boolean;
    is_last_page: boolean;
    current_page: number;
    next_page: number;
    previous_page: number;
  };
};

type CategoriesQueryKey = [
  string,
  {
    name?: string;
    column?: string;
    order?: 'asc' | 'desc';
    per_page?: number;
    page: number;
  },
];

export async function getCategories({
  queryKey,
}: {
  queryKey: CategoriesQueryKey;
}): Promise<PaginatedCategories> {
  const [, { name, column, order, per_page, page }] = queryKey;
  try {
    const { data } = await api.get<PaginatedCategories>(
      `/api/categories?page=${page}&name=${name}&column=${column}&order=${order}&per_page=${per_page}`,
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      }
    }

    throw new Error('Error loading categories.');
  }
}

export async function createCategory(data: {
  name: string;
}): Promise<Category> {
  try {
    const response = await api.post<Category>('/api/categories', data);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      notify(error.response?.data.error, 'error');
    }

    throw new Error('Error creating category.');
  }
}

export async function updateCategory(data: {
  id: string;
  name: string;
}): Promise<Category> {
  try {
    const response = await api.patch<Category>(
      `/api/categories/${data.id}`,
      data,
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      notify(error.response?.data.error, 'error');
    }

    throw new Error('Error updating category.');
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await api.delete(`/api/categories/${id}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      notify(error.response?.data.error, 'error');
    }

    throw new Error('Error deleting category.');
  }
}
