import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTasks } from '../../hooks/useTasks';
import { format } from 'date-fns';
import { LuChevronDown, LuFilePen, LuTrash2 } from 'react-icons/lu';
import Modal from '../../components/Modal';
import { useCategories } from '../../hooks/useCategories';

const schema = z.object({
  id: z.string().optional(),
  category_id: z.string().uuid('O campo categoria é obrigatório.'),
  title: z.string().min(1, { message: 'O campo nome é obrigatório.' }),
  description: z.string().nullable(),
  status: z.string().min(1, { message: 'O campo status é obrigatório.' }),
});

type TaskFormData = z.infer<typeof schema>;

export default function Tasks() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCategory, setFilteredCategory] = useState('');
  const [filteredStatus, setFilteredStatus] = useState('');
  const [perPage, setPerPage] = useState(5);
  const [ordering, setOrdering] = useState('updated_at-desc');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [task, setTask] = useState<TaskFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const { tasks, create, update, deleteTaskById } = useTasks({
    title: search,
    column: ordering.split('-')[0],
    order: ordering.split('-')[1] as 'asc' | 'desc',
    per_page: perPage,
    page: currentPage,
    category_id: filteredCategory,
    status: filteredStatus,
  });

  const { categories } = useCategories({
    name: '',
    column: 'created_at',
    order: 'desc',
    per_page: 999,
    page: 1,
  });

  const onSubmit = async (data: TaskFormData) => {
    if (data.id) {
      await update(data);
    } else {
      await create(data);
    }
    setIsFormModalOpen(false);
    reset();
  };

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  const handleEdit = useCallback(
    (task: TaskFormData) => {
      setTask(task);
      setValue('id', task.id);
      setValue('title', task.title);
      setValue('description', task.description);
      setValue('status', task.status);
      setValue('category_id', task.category_id);
      setIsFormModalOpen(true);
    },
    [setValue],
  );

  const handleOpenModal = useCallback(() => {
    setIsFormModalOpen(true);
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setTask(null);
    reset();
  }, [reset]);

  const handleOpenDeleteModal = useCallback((task: TaskFormData) => {
    setIsDeleteModalOpen(true);
    setTask(task);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setTask(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (task?.id) {
      await deleteTaskById(task.id);
      setIsDeleteModalOpen(false);
      setTask(null);
    }
  }, [task, deleteTaskById]);

  const handleStatusStyle = useCallback((status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-800 p-3 font-semibold rounded-2xl border-yellow-500 border-3';
      case 'in_progress':
        return 'bg-blue-200 text-blue-800 p-3 font-semibold rounded-2xl border-blue-500 border-3';
      case 'done':
        return 'bg-green-200 text-green-800 p-3 font-semibold rounded-2xl border-green-500 border-3';
      default:
        return 'bg-gray-200 font-semibold text-gray-800';
    }
  }, []);

  const handleStatusText = useCallback((status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em andamento';
      case 'done':
        return 'Concluída';
      default:
        return 'Desconhecido';
    }
  }, []);

  return (
    <div className="px-10 py-4">
      <h1 className="text-3xl font-bold text-[#4a154b]">Tarefas</h1>
      <div className="flex justify-between items-center mt-10">
        <input
          type="text"
          placeholder="Buscar tarefa"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-[400px] px-4 py-4 border border-gray-400 rounded-lg"
        />
        <button
          className="bg-[#2eb67d] text-white px-6 py-4 rounded-lg"
          onClick={handleOpenModal}
        >
          Adicionar tarefa
        </button>
      </div>
      <div className="flex items-center justify-between mt-10">
        <div className="flex items-center gap-4">
          <select
            value={filteredCategory}
            onChange={e => setFilteredCategory(e.target.value)}
            className="w-[200px] rounded-lg border-[1px] px-2 py-4 text-black transition focus:border-[#4a154b]"
          >
            <option value="">Categoria</option>
            {categories.data.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={filteredStatus}
            onChange={e => setFilteredStatus(e.target.value)}
            className="w-[200px] rounded-lg border-[1px] px-2 py-4 text-black transition focus:border-[#4a154b]"
          >
            <option value="">Status</option>
            <option value="pending">Pendente</option>
            <option value="in_progress">Em andamento</option>
            <option value="done">Concluída</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={ordering}
            onChange={e => setOrdering(e.target.value)}
            className="w-[220px] rounded-lg border-[1px] px-2 py-4 text-black transition focus:border-[#4a154b]"
          >
            <option value="title-asc">Título</option>
            <option value="updated_at-asc">Data de modificação ↑</option>
            <option value="updated_at-desc">Data de modificação ↓</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto mt-10">
        <table className="table-fixed min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-[#4a154b] text-white">
            <tr>
              <th className="w-1/6 px-6 py-3 text-left text-sm font-medium text-white uppercase">
                #
              </th>
              <th className="w-1/6 px-6 py-3 text-left text-sm font-medium text-white uppercase">
                Título
              </th>
              <th className="w-1/6 px-6 py-3 text-left text-sm font-medium text-white uppercase">
                Categoria
              </th>
              <th className="w-1/6 px-6 py-3 text-left text-sm font-medium text-white uppercase">
                Status
              </th>
              <th className="w-1/6 px-6 py-3 text-left text-sm font-medium text-white uppercase">
                Última atualização
              </th>
              <th className="w-1/6 px-6 py-3 text-right text-sm font-medium text-white uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.data.map((item, index) => (
              <tr key={index} className="odd:bg-gray-100">
                <td className="px-6 py-4 text-sm text-gray-800">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {item.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {item.category.name}
                </td>
                <td className={`px-6 py-4 text-sm`}>
                  <span className={`${handleStatusStyle(item.status)}`}>
                    {handleStatusText(item.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span>
                    {format(new Date(item.updated_at), 'd/LL/yyyy')}{' '}
                    {format(new Date(item.updated_at), 'H:mm')}
                  </span>
                  <span></span>
                </td>
                <td className="px-6 py-4 text-right gap-6">
                  <button
                    className="text-[#36c5f0] font-medium mr-4 cursor-pointer"
                    onClick={() => handleEdit(item)}
                  >
                    <LuFilePen className="text-2xl" />
                  </button>
                  <button
                    className="text-[#e01e5a] font-medium cursor-pointer"
                    onClick={() => handleOpenDeleteModal(item)}
                  >
                    <LuTrash2 className="text-2xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <span className="text-sm text-gray-500">
          Mostrando {tasks.data.length} de {tasks.meta.total} tarefas
        </span>
      </div>
      <div className="flex items-center justify-between gap-48 mt-4">
        <div className="flex items-center gap-48">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800 disabled:opacity-50"
            onClick={() => onPageChange(tasks.meta.previous_page)}
            disabled={tasks.meta.is_first_page}
          >
            Anterior
          </button>
          <span className="text-gray-600">
            Página {tasks.meta.current_page} de{' '}
            {tasks.meta.is_last_page
              ? tasks.meta.current_page
              : (Math.ceil(tasks.meta.total / tasks.data.length) ?? 1)}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800 disabled:opacity-50"
            onClick={() => onPageChange(tasks.meta.next_page)}
            disabled={tasks.meta.is_last_page}
          >
            Próxima
          </button>
        </div>
        <div>
          <span className="mr-2">Exibir por página:</span>
          <select
            value={perPage}
            onChange={e => setPerPage(Number(e.target.value))}
            className="rounded-lg border-[1px] p-2 text-black transition focus:border-[#4a154b]"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="10">15</option>
            <option value="20">20</option>
            <option value="30">25</option>
          </select>
        </div>
      </div>
      <Modal
        title={task ? 'Editar tarefa' : 'Cadastrar tarefa'}
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onConfirm={handleSubmitForm}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-start gap-4 py-10"
        >
          <input
            type="hidden"
            {...register('id')}
            name="id"
            className="hidden"
          />
          <input
            type="text"
            {...register('title')}
            placeholder="Título da tarefa*"
            className="flex-1 w-full rounded-lg border-[1px] px-5 py-4 text-black transition focus:border-[#4a154b]"
          />
          {errors && errors.title && (
            <span className="text-sm text-red-500">
              {errors?.title?.message}
            </span>
          )}
          <textarea
            {...register('description')}
            placeholder="Descrição da tarefa"
            rows={4}
            className="flex-1 w-full rounded-lg border-[1px] px-5 py-4 text-black transition focus:border-[#4a154b]"
          />
          <div className="w-full">
            <select
              {...register('category_id')}
              className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent p-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="">Selecione uma categoria</option>
              {categories.data.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <span className="absolute right-8 bottom-[190px] z-10 -translate-y-1/2">
              <LuChevronDown size={20} />
            </span>
            {errors && errors.title && (
              <span className="text-sm text-red-500">
                {errors?.category_id?.message}
              </span>
            )}
          </div>
          <div className="w-full">
            <select
              {...register('status')}
              className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent p-3 outline-none transition"
            >
              <option value="">Selecione um status</option>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em andamento</option>
              <option value="done">Concluída</option>
            </select>
            <span className="absolute right-8 bottom-[125px] z-10 -translate-y-1/2">
              <LuChevronDown size={20} />
            </span>
            {errors && errors.title && (
              <span className="text-sm text-red-500">
                {errors?.status?.message}
              </span>
            )}
          </div>
        </form>
      </Modal>
      <Modal
        title="Excluir tarefa"
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
      >
        <p className="py-10">Você realmente deseja excluir essa tarefa?</p>
      </Modal>
    </div>
  );
}
