import {
  Navigate,
  Routes as ReactRouterDOMRoutes,
  Route,
  useLocation,
} from 'react-router-dom';
import Categories from '../pages/Categories';
import Tasks from '../pages/Tasks';
import SignIn from '../pages/SignIn';
import { useAuth } from '../hooks/useAuth';
import { JSX } from 'react';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default function Routes() {
  const { user } = useAuth();

  const pathname = useLocation().pathname;

  if (user && pathname === '/signin') {
    return <Navigate to="/tasks" />;
  }

  return (
    <ReactRouterDOMRoutes>
      <Route path="/signin" element={<SignIn />} />

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />
    </ReactRouterDOMRoutes>
  );
}
