import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTask,
  CreateUpdateTaskData,
  deleteTask,
  getTasks,
  updateTask,
} from '../services/api/tasks';

export type GetTasksQueryParams = {
  title?: string;
  column?: string;
  order?: 'asc' | 'desc';
  per_page?: number;
  category_id?: string;
  status?: string;
  page: number;
};

export function useTasks({
  title,
  column,
  order,
  per_page,
  category_id,
  status,
  page,
}: GetTasksQueryParams) {
  const queryClient = useQueryClient();

  const {
    data: tasks = {
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
    queryKey: [
      'tasks',
      { title, column, order, per_page, page, category_id, status },
    ],
    queryFn: () =>
      getTasks({ title, column, order, per_page, page, category_id, status }),
    enabled: true,
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const create = async (data: CreateUpdateTaskData) => {
    await createMutation.mutateAsync(data);
  };

  const update = async (data: CreateUpdateTaskData) => {
    await updateMutation.mutateAsync(data);
  };

  const deleteTaskById = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return { tasks, create, update, deleteTaskById, isLoading, isError };
}
