import { useState } from 'react';
import { UserProvider } from './context/UserContext';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import Navbar from './components/Navbar';
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

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [targetPostId, setTargetPostId] = useState(1);
  const [targetUsername, setTargetUsername] = useState('alex_dev');

  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Use Custom Hook to update document title based on active page
  useDocumentTitle(
    activePage === 'home'
      ? 'Feed Home'
      : activePage === 'dashboard'
      ? 'Developer Dashboard'
      : activePage === 'post-detail'
      ? 'Code Review Discussion'
      : activePage === 'profile'
      ? `@${targetUsername}'s Profile`
      : activePage === 'login'
      ? 'Sign In'
      : 'Create Account'
  );

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
      {/* Global Moderator Banner consuming UserContext */}
      <AdminModBanner />

      {/* Main Navbar consuming UserContext */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenCommand={() => setIsCommandOpen(true)}
        onOpenNewPost={() => setIsNewPostOpen(true)}
      />

      <div className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
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

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={handleNavigate}
      />

      <ToastStack toasts={toasts} onDismiss={removeToast} />

      <RefactorModal
        isOpen={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        onSubmitRefactor={() => {
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

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}