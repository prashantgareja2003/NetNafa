import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';

export function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
