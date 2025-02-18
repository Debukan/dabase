import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import TaskPage from './pages/TaskPage';
import SearchPage from './pages/SearchPage';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks/:site" element={<TasksPage />} />
          <Route path="/task/:taskId" element={<TaskPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;