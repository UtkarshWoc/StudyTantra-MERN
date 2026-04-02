import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import DocumentDetails from './pages/DocumentDetails';
import Flashcards from './pages/Flashcards';
import Quizzes from './pages/Quizzes';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';



// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Guest Route Wrapper – redirects to dashboard if already logged in
const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Error Boundary / 404 Route Placeholder
const NotFound = () => <div className="p-8 text-center"><h1 className="text-3xl font-bold text-red-600 mb-4">404 - Not Found</h1><p className="text-gray-600">The page you're looking for doesn't exist.</p></div>;

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            
            {/* Protected Routes inside Layout */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="documents">
                <Route index element={<Documents />} />
                <Route path=":id" element={<DocumentDetails />} />
              </Route>
              <Route path="flashcards" element={<Flashcards />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
