import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Toaster } from 'react-hot-toast';
import SocketHandler from './components/SocketHandler';
import AppRoutes from './routes/AppRoutes';
import { useSelector } from 'react-redux'; 

const ChatWidget = lazy(() => import('./components/chat/ChatWidget'));

function App() {
   const { darkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
      <BrowserRouter>
        <SocketHandler />
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
  );
}

export default App;