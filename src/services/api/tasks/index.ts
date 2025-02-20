import { AxiosError } from 'axios';
import api from '../../api';
import { notify } from '../../../helpers/notify';

export type Task = {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string | null;
  status: string;
  category: {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
};

export type PaginatedTasks = {
  data: Task[];
  meta: {
    total: number;
    is_first_page: boolean;
    is_last_page: boolean;
    current_page: number;
    next_page: number;
    previous_page: number;
  };
};

type GetTasksQueryParams = {
  title?: string;
  column?: string;
  order?: 'asc' | 'desc';
  per_page?: number;
  category_id?: string;
  status?: string;
  page: number;
};

export type CreateUpdateTaskData = {
  id?: string;
  title: string;
  category_id: string;
  status: string;
  description: string | null;
};

export async function getTasks({
  title,
  column,
  order,
  per_page,
  category_id,
  status,
  page,
}: GetTasksQueryParams): Promise<PaginatedTasks> {
  try {
    const { data } = await api.get<PaginatedTasks>(
      `/api/tasks?page=${page}&title=${title}&category_id=${category_id}&status=${status}&column=${column}&order=${order}&per_page=${per_page}`,
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

export async function createTask(data: CreateUpdateTaskData): Promise<Task> {
  try {
    const response = await api.post<Task>('/api/tasks', data);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      notify(error.response?.data.error, 'error');
    }

    throw new Error('Error creating task.');
  }
}

export async function updateTask(data: CreateUpdateTaskData): Promise<Task> {
  try {
    const response = await api.patch<Task>(`/api/tasks/${data.id}`, data);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      notify(error.response?.data.error, 'error');
    }

    throw new Error('Error updating task.');
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    await api.delete(`/api/tasks/${id}`);
  } catch (error) {
    if (error instanceof AxiosError) {
      notify(error.response?.data.error, 'error');
    }

    throw new Error('Error deleting task.');
  }
}
