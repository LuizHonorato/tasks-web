import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { notify } from '../../helpers/notify';
import { useAuth } from '../../hooks/useAuth';

const schema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(4, 'Sua senha deve ter no mínimo 4 caracteres'),
});

type SignInFormData = z.infer<typeof schema>;

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  async function handleSignIn(data: SignInFormData) {
    try {
      await signIn(data);

      reset();
      navigate('/tasks');
    } catch (error) {
      console.log(error);
      notify('Erro ao logar', 'error');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-sm h-screen w-full bg-white">
      <span className="text-5xl font-bold leading-1 text-[#4a154b]">
        myTasks
      </span>
      <div className="w-1/3 p-4 sm:p-12 xl:p-16">
        <h2 className="mb-9 text-2xl font-bold text-black text-center">
          Seja bem-vindo
        </h2>

        <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
          <div>
            <Input
              type="email"
              name="email"
              register={register}
              className="w-full p-2 mt-2 h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="E-mail*"
              error={errors.email?.message}
            />
          </div>

          <div>
            <Input
              type="password"
              name="password"
              register={register}
              className="w-full p-2 mt-2 h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Senha*"
              error={errors.password?.message}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 h-12 text-white font-semibold rounded-md bg-[#2eb67d] hover:bg-[#4f9477] transition-colors duration-300"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
