import { LuFilePen, LuTrash2 } from 'react-icons/lu';
import { useCategories } from '../../hooks/useCategories';
import { useCallback, useState } from 'react';
import { format } from 'date-fns';
import Modal from '../../components/Modal';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'O campo nome é obrigatório.' }),
});

type CategoryFormData = z.infer<typeof schema>;

export default function Categories() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordering, setOrdering] = useState('updated_at-desc');
  const [perPage, setPerPage] = useState(5);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [category, setCategory] = useState<CategoryFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const { categories, create, update, deleteCategoryById } = useCategories({
    name: search,
    column: ordering.split('-')[0],
    order: ordering.split('-')[1] as 'asc' | 'desc',
    per_page: perPage,
    page: currentPage,
  });

  const onSubmit = async (data: CategoryFormData) => {
    if (data.id) {
      await update({ id: data.id, name: data.name });
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
    (category: CategoryFormData) => {
      setCategory(category);
      setValue('id', category.id);
      setValue('name', category.name);
      setIsFormModalOpen(true);
    },
    [setValue],
  );

  const handleOpenModal = useCallback(() => {
    setIsFormModalOpen(true);
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setCategory(null);
    reset();
  }, [reset]);

  const handleOpenDeleteModal = useCallback((category: CategoryFormData) => {
    setIsDeleteModalOpen(true);
    setCategory(category);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setCategory(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (category?.id) {
      await deleteCategoryById(category.id);
      setIsDeleteModalOpen(false);
      setCategory(null);
    }
  }, [category, deleteCategoryById]);

  return (
    <div className="px-10 py-4">
      <h1 className="text-3xl font-bold text-[#4a154b]">Categorias</h1>
      <div className="flex justify-between items-center mt-10">
        <input
          type="text"
          placeholder="Buscar categoria"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-[400px] px-4 py-4 border border-gray-400 rounded-lg"
        />
        <button
          className="bg-[#2eb67d] text-white px-6 py-4 rounded-lg"
          onClick={handleOpenModal}
        >
          Adicionar categoria
        </button>
      </div>
      <div className="flex items-center justify-end mt-10">
        <div className="flex items-center gap-4">
          <select
            value={ordering}
            onChange={e => setOrdering(e.target.value)}
            className="w-[220px] rounded-lg border-[1px] px-2 py-4 text-black transition focus:border-[#4a154b]"
          >
            <option value="name-asc">Título</option>
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
              <th className="w-2/6 px-6 py-3 text-left text-sm font-medium text-white uppercase">
                Nome
              </th>
              <th className="w-2/6 px-6 py-3 text-left text-sm font-medium text-white uppercase">
                Última atualização
              </th>
              <th className="w-1/6 px-6 py-3 text-right text-sm font-medium text-white uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.data.map((item, index) => (
              <tr key={index} className="odd:bg-gray-100">
                <td className="px-6 py-4 text-sm text-gray-800">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{item.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span>
                    {format(new Date(item.updated_at), 'd/LL/yyyy')}{' '}
                    {format(new Date(item.updated_at), 'H:mm')}
                  </span>
                  <span></span>
                </td>
                <td className="px-6 py-4 text-right gap-6">
                  <button
                    className="text-[#36c5f0] font-medium mr-4"
                    onClick={() => handleEdit(item)}
                  >
                    <LuFilePen className="text-2xl" />
                  </button>
                  <button
                    className="text-[#e01e5a] font-medium"
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
          Mostrando {categories.data.length} de {categories.meta.total}{' '}
          categorias
        </span>
      </div>
      <div className="flex items-center justify-between gap-48 mt-4">
        <div className="flex items-center gap-48">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800 disabled:opacity-50"
            onClick={() => onPageChange(categories.meta.previous_page)}
            disabled={categories.meta.is_first_page}
          >
            Anterior
          </button>
          <span className="text-gray-600">
            Página {categories.meta.current_page} de{' '}
            {Math.ceil(categories.meta.total / categories.data.length) ?? 1}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800 disabled:opacity-50"
            onClick={() => onPageChange(categories.meta.next_page)}
            disabled={categories.meta.is_last_page}
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
        title={category ? 'Editar categoria' : 'Cadastrar categoria'}
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
            {...register('name')}
            placeholder="Nome da categoria*"
            className="flex-1 w-full rounded-lg border-[1px] px-5 py-4 text-black transition focus:border-[#4a154b]"
          />
          {errors && errors.name && (
            <span className="text-sm text-red-500">
              {errors?.name?.message}
            </span>
          )}
        </form>
      </Modal>
      <Modal
        title="Excluir categoria"
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
      >
        <p className="py-10">Você realmente deseja excluir essa categoria?</p>
      </Modal>
    </div>
  );
}
