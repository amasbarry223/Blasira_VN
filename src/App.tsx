import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { AuthProvider } from "./contexts/AuthContext";
import AdminLayout from "./components/admin/AdminLayout";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import BottomNav from "./components/BottomNav";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LazyLoadErrorBoundary from "./components/LazyLoadErrorBoundary";
import { OfflineIndicator } from "./components/OfflineIndicator";
import ProtectedRoute from "./components/ProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";
import { lazyLoadNamed } from "./utils/lazyLoad";
import AdminLogin from "./pages/admin/AdminLogin";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import MyTrips from "./pages/MyTrips";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import PublishTrip from "./pages/PublishTrip";
import SearchResults from "./pages/SearchResults";
import TripDetail from "./pages/TripDetail";

// Lazy load admin routes for code splitting with error handling and retry
const Dashboard = lazyLoadNamed("Dashboard", () => import("./pages/admin/Dashboard"));
const Users = lazyLoadNamed("Users", () => import("./pages/admin/Users"));
const Trips = lazyLoadNamed("Trips", () => import("./pages/admin/Trips"));
const Bookings = lazyLoadNamed("Bookings", () => import("./pages/admin/Bookings"));
const Incidents = lazyLoadNamed("Incidents", () => import("./pages/admin/Incidents"));
const Notifications = lazyLoadNamed("Notifications", () => import("./pages/admin/Notifications"));
const Statistics = lazyLoadNamed("Statistics", () => import("./pages/admin/Statistics"));
const Settings = lazyLoadNamed("Settings", () => import("./pages/admin/Settings"));

// Loading fallback component
const AdminPageSkeleton = () => (
  <div className="space-y-6 p-6">
    <Skeleton className="h-8 w-64" />
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  </div>
);

/**
 * Constantes pour la configuration du QueryClient
 */
const QUERY_RETRY_ATTEMPTS = 3;
const QUERY_RETRY_DELAY_BASE_MS = 1000;
const QUERY_RETRY_DELAY_MAX_MS = 30000;
const QUERY_STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes
const MUTATION_RETRY_ATTEMPTS = 1;

/**
 * Initialize query client with retry configuration
 * Créé en dehors du composant pour éviter la recréation à chaque render
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: QUERY_RETRY_ATTEMPTS,
      retryDelay: (attemptIndex) => 
        Math.min(QUERY_RETRY_DELAY_BASE_MS * 2 ** attemptIndex, QUERY_RETRY_DELAY_MAX_MS),
      refetchOnWindowFocus: false,
      staleTime: QUERY_STALE_TIME_MS,
    },
    mutations: {
      retry: MUTATION_RETRY_ATTEMPTS,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OfflineIndicator />
        <BrowserRouter>
        <Routes>
          {/* Redirect /login to /admin/login */}
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          
          {/* Admin routes */}
          <Route
            path="/admin/login"
            element={
              <AdminAuthProvider>
                <AdminLogin />
              </AdminAuthProvider>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminAuthProvider>
                <AdminProtectedRoute>
                  <AdminLayout>
                    <LazyLoadErrorBoundary>
                      <Suspense fallback={<AdminPageSkeleton />}>
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/users" element={<Users />} />
                          <Route path="/trips" element={<Trips />} />
                          <Route path="/bookings" element={<Bookings />} />
                          <Route path="/incidents" element={<Incidents />} />
                          <Route path="/notifications" element={<Notifications />} />
                          <Route path="/statistics" element={<Statistics />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="*" element={<Dashboard />} />
                        </Routes>
                      </Suspense>
                    </LazyLoadErrorBoundary>
                  </AdminLayout>
                </AdminProtectedRoute>
              </AdminAuthProvider>
            }
          />
          
          {/* Public routes */}
          <Route
            path="/*"
            element={
              <AuthProvider>
                <Header />
                <main className="min-h-screen">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/trip/:id" element={<TripDetail />} />
                    <Route path="/publish" element={<ProtectedRoute><PublishTrip /></ProtectedRoute>} />
                    <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <BottomNav />
              </AuthProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
