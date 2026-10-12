import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/admin/login`, credentials);
      localStorage.setItem('admin_token', response.data.access_token);
      toast.success('Успешный вход!');
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" data-testid="admin-login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo-brand">
              <div className="login-logo-text">
                <span className="login-logo-primary">DARS</span>
                <span className="login-logo-secondary">CAPITAL</span>
              </div>
              <div className="login-logo-tagline">Premium Real Estate</div>
            </div>
            <h1 data-testid="login-title">Вход в админ-панель</h1>
            <p>Введите ваши учетные данные</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Логин</label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                placeholder="admin"
                required
                data-testid="login-username-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="••••••••"
                required
                data-testid="login-password-input"
              />
            </div>

            <Button 
              type="submit" 
              className="login-btn" 
              disabled={loading}
              data-testid="login-submit-button"
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>

          <div className="login-footer">
            <p className="login-hint">По умолчанию: admin / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;