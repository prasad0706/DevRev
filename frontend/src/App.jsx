import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminModBanner from './components/AdminModBanner';
import CommandPalette from './components/CommandPalette';
import ToastStack from './components/ToastStack';
import RefactorModal from './components/RefactorModal';

import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [targetPostId, setTargetPostId] = useState(1);
  const [targetUsername, setTargetUsername] = useState('alex_dev');

  const [isModMode, setIsModMode] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);

  const [toasts, setToasts] = useState([]);

  const addToast = ({ title, message, type = 'info' }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigate = (page, param) => {
    setActivePage(page);
    if (page === 'post-detail' && param) setTargetPostId(param);
    if (page === 'profile' && param) setTargetUsername(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#E8E8EA] flex flex-col font-sans selection:bg-[#4F9CF9] selection:text-white">
      {/* Top Moderator Mode Banner */}
      <AdminModBanner
        isModMode={isModMode}
        onToggleMod={() => setIsModMode(false)}
      />

      {/* Main Sticky Navbar */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenCommand={() => setIsCommandOpen(true)}
        onOpenNewPost={() => setIsNewPostOpen(true)}
        isModMode={isModMode}
        onToggleMod={() => setIsModMode(!isModMode)}
      />

      {/* Main Page View Container */}
      <div className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            isModMode={isModMode}
            onShowToast={addToast}
          />
        )}

        {activePage === 'post-detail' && (
          <PostDetailPage
            postId={targetPostId}
            onNavigate={handleNavigate}
            onShowToast={addToast}
          />
        )}

        {activePage === 'login' && (
          <LoginPage onNavigate={handleNavigate} />
        )}

        {activePage === 'register' && (
          <RegisterPage onNavigate={handleNavigate} />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage onNavigate={handleNavigate} />
        )}

        {activePage === 'profile' && (
          <ProfilePage username={targetUsername} onNavigate={handleNavigate} />
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* Interactive Overlays */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={handleNavigate}
      />

      <ToastStack toasts={toasts} onDismiss={removeToast} />

      {/* New Code Post Modal Trigger */}
      <RefactorModal
        isOpen={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        onSubmitRefactor={(data) => {
          addToast({
            title: 'Code Snippet Posted!',
            message: 'Your snippet is now live in the feed for peer review.',
            type: 'success',
          });
        }}
      />
    </div>
  );
}