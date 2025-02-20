import { LuLogOut } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/signin');
  };

  return (
    <header className="bg-[#4a154b] h-[60px] flex items-center px-10 gap-10">
      <span className="text-3xl font-bold leading-1 text-white">myTasks</span>
      <nav className="flex items-center justify-between w-full">
        <ul className="flex gap-8 text-lg text-white">
          <li>
            <Link to="/tasks">Tarefas</Link>
          </li>
          <li>
            <Link to="/categories">Categorias</Link>
          </li>
        </ul>
        {user && (
          <ul className="flex items-center gap-8 text-lg text-white">
            <li>Olá, {user.name}</li>
            <li className="cursor-pointer" onClick={handleSignOut}>
              <LuLogOut className="text-xl" />
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
