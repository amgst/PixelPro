import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Contact from './pages/Contact';
import About from './pages/About';
import ShopifyLanding from './pages/ShopifyLanding';
import WebDevLanding from './pages/WebDevLanding';
import GraphicsLanding from './pages/GraphicsLanding';
import ProjectInquiry from './pages/ProjectInquiry';
import Pricing from './pages/Pricing';
import WebsitesForSale from './pages/WebsitesForSale';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Tools from './pages/Tools';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminTools from './pages/admin/Tools';
import AdminPortfolio from './pages/admin/Portfolio';
import AdminSettings from './pages/admin/Settings';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-fade-in">
      {children}
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/shopify" element={<ShopifyLanding />} />
            <Route path="/web-dev" element={<WebDevLanding />} />
            <Route path="/graphics" element={<GraphicsLanding />} />
            <Route path="/inquiry" element={<ProjectInquiry />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/websites-for-sale" element={<WebsitesForSale />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/tools" element={<Tools />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/tools" element={<AdminTools />} />
            <Route path="/admin/portfolio" element={<AdminPortfolio />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Routes>
        </PageWrapper>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
};

export default App;