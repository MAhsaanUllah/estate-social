import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getCurrentUser } from './redux/authSlice';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import AgentRoute from './components/AgentRoute';
import { Loader2 } from 'lucide-react';

const Landing = React.lazy(() => import('./pages/Landing'));
const Feed = React.lazy(() => import('./pages/Feed'));
const ListingDetails = React.lazy(() => import('./pages/ListingDetails'));
const AgentProfile = React.lazy(() => import('./pages/AgentProfile'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AddProperty = React.lazy(() => import('./pages/AddProperty'));
const EditProperty = React.lazy(() => import('./pages/EditProperty'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const AgentDirectory = React.lazy(() => import('./pages/AgentDirectory'));
const PropertyValuation = React.lazy(() => import('./pages/PropertyValuation'));
const HelpCenter = React.lazy(() => import('./pages/HelpCenter'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const SafetyGuidelines = React.lazy(() => import('./pages/SafetyGuidelines'));
const LoanCalculator = React.lazy(() => import('./pages/LoanCalculator'));
const ConstructionCalculator = React.lazy(() => import('./pages/ConstructionCalculator'));
const UnitConverter = React.lazy(() => import('./pages/UnitConverter'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogPostDetail = React.lazy(() => import('./pages/BlogPostDetail'));
const AdminConsole = React.lazy(() => import('./pages/AdminConsole'));
function GlobalLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <GlobalLoader />;
  }

  return (
    <ErrorBoundary>
      <Layout>
        <main className="min-h-screen bg-gray-50">
          <Suspense fallback={<GlobalLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/properties" element={<Feed />} />
              <Route path="/listing/:id" element={<ListingDetails />} />
              <Route path="/agent/:id" element={<AgentProfile />} />
              <Route path="/@:id" element={<AgentProfile />} />
              <Route path="/agency/:id" element={<AgentProfile />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-property"
                element={
                  <ProtectedRoute>
                    <AddProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-property/:id"
                element={
                  <ProtectedRoute>
                    <EditProperty />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
              <Route path="/about" element={<About />} />
              <Route path="/loan-calculator" element={<LoanCalculator />} />
              <Route path="/construction-cost-calculator" element={<ConstructionCalculator />} />
              <Route path="/unit-converter" element={<UnitConverter />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/agents" element={<AgentDirectory />} />
              <Route path="/valuation" element={<PropertyValuation />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/safety" element={<SafetyGuidelines />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminConsole />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Toaster position="top-right" />
      </Layout>
    </ErrorBoundary>
  );
}

export default App;