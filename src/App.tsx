import { BrowserRouter, useLocation } from 'react-router-dom';
import Routes from './routes';
import Header from './components/Header';
import AppProvider from './hooks';
import { Toaster } from 'react-hot-toast';

function Layout() {
  const location = useLocation();

  const hideHeaderOnRoutes = ['/signin'];

  return (
    <>
      {!hideHeaderOnRoutes.includes(location.pathname) && <Header />}
      <Routes />
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 2000,
          success: {
            style: {
              backgroundColor: '#0f0f0f',
              color: 'green',
            },
            icon: null,
          },
          error: {
            style: {
              backgroundColor: '#0f0f0f',
              color: 'red',
            },
            icon: null,
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AppProvider>
  );
}
