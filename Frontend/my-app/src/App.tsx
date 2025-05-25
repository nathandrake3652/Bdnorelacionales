import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {AppRoutes} from './routes/AppRoutes';
import { ProveedorAuth } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

const clienteQuery = new QueryClient();

function App() {
  return(
    <ProveedorAuth>
      <QueryClientProvider client = {clienteQuery}>
        <BrowserRouter>
          <div className='App'>
            <AppRoutes/>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </ProveedorAuth>
  ) 
};

export default App;
