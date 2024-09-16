// client\src\App.jsx
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VerifyEmail from './components/auth/VerifyEmail';
import TwoFAVerification from './components/auth/TwoFAVerification';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './components/layout/Dashboard';
import Header from './components/layout/Header';
import DashboardHeader from './components/layout/DashboardHeader';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Resources from './pages/Resources';
import ProtectedRoute from './utils/ProtectedRoute';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SubscriptionPlans from './components/subscribe/SubscriptionPlans';
import SuccessPage from './components/subscribe/SuccessPage';
import DynamicPage from './pages/DynamicPage'; // Import the DynamicPage component
import ChatBot from './components/chatbot/ChatBot';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const App = () => {
  const location = useLocation();

  const protectedRoutes = [
    '/dashboard',
    '/enrollment',
    '/success',
    // Add more protected routes here as needed
  ];

  const noHeaderFooterRoutes = ['/login', '/register']; // Routes without Header/Footer

  const isProtectedRoute = protectedRoutes.includes(location.pathname);
  const isNoHeaderFooterRoute = noHeaderFooterRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <NotificationProvider>
        <SocketProvider>
          <Elements stripe={stripePromise}>
            <div className="flex flex-col min-h-screen">
              {/* Conditionally render the header based on the route */}
              {!isNoHeaderFooterRoute && (isProtectedRoute ? <DashboardHeader /> : <Header />)}
              <main className="flex-grow">
                <Routes>
                  {/* System */}
                  <Route path="/" element={<Home />} />
                  <Route path="*" element={<NotFound />} />
                  {/* Public */}
                  <Route path="/about" element={<About />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/resources" element={<Resources />} />
                  {/* Auth */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/auth/verify-email" element={<VerifyEmail />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/2fa" element={<TwoFAVerification />} />
                  {/* Protected */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/enrollment" element={<ProtectedRoute><SubscriptionPlans /></ProtectedRoute>} />
                  <Route path="/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
                  {/* Public Dynamic CMS Pages */}
                  <Route path="/:route" element={<DynamicPage />} />
                </Routes>
                <ChatBot />
              </main>
              {/* Conditionally render the footer based on the route */}
              {!isProtectedRoute && !isNoHeaderFooterRoute && <Footer />}
            </div>
            {/* Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Elements>
        </SocketProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
