import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';

// Route-level code splitting: heavy pages (the PDF viewer pulls in pdf.js) load on demand
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Documents = lazy(() => import('./pages/Documents'));
const DocumentDetails = lazy(() => import('./pages/DocumentDetails'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const Quizzes = lazy(() => import('./pages/Quizzes'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Favorites = lazy(() => import('./pages/Favorites'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Review = lazy(() => import('./pages/Review'));
const Planner = lazy(() => import('./pages/Planner'));
const PlanDetail = lazy(() => import('./pages/PlanDetail'));
const CollectionDetail = lazy(() => import('./pages/CollectionDetail'));

const PageLoader = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
  </div>
);
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/auth';
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
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
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
              <Route path="review" element={<Review />} />
              <Route path="flashcards" element={<Flashcards />} />
              <Route path="planner" element={<Planner />} />
              <Route path="planner/:id" element={<PlanDetail />} />
              <Route path="collections/:id" element={<CollectionDetail />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
