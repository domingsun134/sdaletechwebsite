import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import OurVision from './pages/OurVision';
import GlobalPresence from './pages/GlobalPresence';
import Automotive from './pages/Automotive';
import ConsumerIT from './pages/ConsumerIT';
import Healthcare from './pages/Healthcare';
import Tooling from './pages/Tooling';
import ToolingCapabilities from './pages/ToolingCapabilities';
import Innovation from './pages/Innovation';
import Capabilities from './pages/Capabilities';
import PPE from './pages/PPE';
import { About, Business, Careers } from './pages/OtherPages';
import BoardOfDirectors from './pages/BoardOfDirectors';
import Sustainability from './pages/Sustainability';
import InvestorRelations from './pages/InvestorRelations';
import Contact from './pages/Contact';
import Career from './pages/Career';
import JobOpportunities from './pages/JobOpportunities';
import JobDetails from './pages/JobDetails';
import Internships from './pages/Internships';
import TalentCommunity from './pages/TalentCommunity';

import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { JobProvider } from './context/JobContext';
import { EventProvider } from './context/EventContext';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ContentEditor from './pages/admin/ContentEditor';
import Analytics from './pages/admin/Analytics';
import JobManager from './pages/admin/JobManager';
import EventManager from './pages/admin/EventManager';
import UserManager from './pages/admin/UserManager';
import Events from './pages/Events';
import InterviewBooking from './pages/InterviewBooking';
import CandidateOnboarding from './pages/CandidateOnboarding';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { initGA, logPageView } from './utils/analytics';

function App() {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    logPageView();
  }, [location]);

  return (
    <AuthProvider>
      <ContentProvider>
        <JobProvider>
          <EventProvider>
            <ScrollToTop />
            <Routes>
              {/* Admin Routes - Must be before catch-all */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/content" element={
                <ProtectedRoute>
                  <ContentEditor />
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/admin/jobs" element={
                <ProtectedRoute>
                  <JobManager />
                </ProtectedRoute>
              } />
              <Route path="/admin/events" element={
                <ProtectedRoute>
                  <EventManager />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <UserManager />
                </ProtectedRoute>
              } />

              {/* Public Booking Route */}
              <Route path="/schedule/:applicationId" element={<InterviewBooking />} />
              <Route path="/onboarding/:applicationId" element={<CandidateOnboarding />} />

              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="about/board-of-director" element={<BoardOfDirectors />} />
                <Route path="about/vision" element={<OurVision />} />
                <Route path="about/global-presence" element={<GlobalPresence />} />
                <Route path="about/sustainability" element={<Sustainability />} />
                <Route path="about/events" element={<Events />} />
                <Route path="business" element={<Business />} />
                <Route path="business/automotive" element={<Automotive />} />
                <Route path="business/consumer-it" element={<ConsumerIT />} />
                <Route path="business/healthcare" element={<Healthcare />} />
                <Route path="business/tooling" element={<Tooling />} />
                <Route path="capabilities/manufacturing" element={<ToolingCapabilities />} />
                <Route path="business/ppe" element={<PPE />} />
                <Route path="capabilities" element={<Capabilities />} />
                <Route path="capabilities/innovation" element={<Innovation />} />
                <Route path="contact" element={<Contact />} />
                <Route path="careers" element={<Career />} />
                <Route path="careers/job-opportunities" element={<JobOpportunities />} />
                <Route path="careers/job-opportunities/:id" element={<JobDetails />} />
                <Route path="careers/internships" element={<Internships />} />
                <Route path="careers/talent-community" element={<TalentCommunity />} />
                <Route path="investor-relations" element={<InvestorRelations />} />
                <Route path="*" element={<div className="p-20 text-center">Page Not Found</div>} />
              </Route>
            </Routes>
          </EventProvider>
        </JobProvider>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
