
import { useState, useEffect } from 'react';
import LoginScreen from '../components/LoginScreen';
import Terminal from '../components/Terminal';
import AdminPanel from '../components/AdminPanel';
import { User, LoginAttempt } from '../types';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const handleLogin = (username: string, password: string, userAgent: string, ip: string) => {
    const timestamp = new Date().toISOString();
    const attempt: LoginAttempt = {
      id: Date.now().toString(),
      username,
      ip,
      userAgent,
      timestamp,
      success: false
    };

    // Validate credentials
    if ((username === 'Guest' && password === 'Veggies') || 
        (username === 'Admin' && password === 'VeggiesAdmin')) {
      
      // Check if site is locked and user is Guest
      if (isLocked && username === 'Guest') {
        setLoginAttempts(prev => [...prev, { ...attempt, success: false }]);
        return false;
      }

      attempt.success = true;
      setUser({
        username,
        role: username === 'Admin' ? 'admin' : 'guest',
        loginTime: timestamp,
        ip,
        userAgent
      });
      setLoginAttempts(prev => [...prev, attempt]);
      return true;
    }

    setLoginAttempts(prev => [...prev, attempt]);
    return false;
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (user.role === 'admin') {
    return (
      <AdminPanel 
        user={user}
        loginAttempts={loginAttempts}
        onLogout={handleLogout}
        isLocked={isLocked}
        onToggleLock={setIsLocked}
        onClearLogs={() => setLoginAttempts([])}
      />
    );
  }

  return <Terminal user={user} onLogout={handleLogout} isLocked={isLocked} />;
};

export default Index;
