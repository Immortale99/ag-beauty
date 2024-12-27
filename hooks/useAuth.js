import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userFromCookie = Cookies.get('user');
    if (userFromCookie) {
      try {
        setUser(JSON.parse(userFromCookie));
      } catch (error) {
        Cookies.remove('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        Cookies.set('user', JSON.stringify(data));
        setUser(data);
        return { success: true };
      }

      return { success: false, error: data.error || 'Erreur de connexion' };
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const logout = () => {
    Cookies.remove('user');
    setUser(null);
  };

  return { user, isLoading, login, logout };
}