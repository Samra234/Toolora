import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { RecentToolsProvider } from './context/RecentToolsContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';

const AllToolsPage = lazy(() => import('./pages/AllToolsPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ToolDetailPage = lazy(() => import('./pages/ToolDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-8 w-48 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
      <div className="mt-6 h-64 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RecentToolsProvider>
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tools" element={<AllToolsPage />} />
                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                <Route path="/tools/:toolSlug" element={<ToolDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </RecentToolsProvider>
    </ThemeProvider>
  );
}
