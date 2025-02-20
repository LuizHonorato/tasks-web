import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import api from '../services/api';
import { getCookie } from '../helpers/get-cookie';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  access_token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren) => {
  const [data, setData] = useState<AuthState>(() => {
    const access_token = localStorage.getItem('@TasksApp:access_token');
    const user = localStorage.getItem('@TasksApp:user');

    if (access_token && user) {
      api.defaults.headers.authorization = `Bearer ${access_token}`;

      return { access_token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    await api.get('/sanctum/csrf-cookie');

    api.defaults.headers['X-XSRF-TOKEN'] = getCookie('XSRF-TOKEN');

    const response = await api.post(
      '/api/auth/login',
      {
        email,
        password,
      },
      {
        headers: {
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
        },
      },
    );

    const { access_token, user } = response.data;

    localStorage.setItem('@TasksApp:access_token', access_token);
    localStorage.setItem('@TasksApp:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${access_token}`;

    setData({ access_token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@TasksApp:access_token');
    localStorage.removeItem('@TasksApp:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
