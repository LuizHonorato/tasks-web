import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom';
import AppProvider from './hooks';
import Routes from './routes';
import { light } from './styles/themes';

function App() {
  return (
    <ChakraProvider theme={light}>
      <Router>
        <AppProvider>
          <Routes />
        </AppProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
