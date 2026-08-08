import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux'; 
import { store } from './redux/store';
import { Toaster } from 'react-hot-toast';
import SocketHandler from './components/SocketHandler';
import AppRoutes from './routes/AppRoutes';

const ChatWidget = lazy(() => import('./components/chat/ChatWidget'));

function App() {
  const { darkMode } = useSelector((state) => state.theme);
  const { isAuthenticated } = useSelector((state) => state.auth); 

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
      <Suspense fallback={null}>
        {isAuthenticated && <ChatWidget />} 
      </Suspense>

    </BrowserRouter>
  );
}

export default App;