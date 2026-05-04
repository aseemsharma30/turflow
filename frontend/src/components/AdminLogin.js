import React, { useState } from 'react';
import { FiLock, FiLogIn } from 'react-icons/fi';
import { apiUrl } from '../apiConfig';
import './AdminLogin.css';

const ADMIN_SESSION_KEY = 'turflow_admin_authenticated';

export const isAdminAuthenticated = () => (
  sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true'
);

export const clearAdminSession = () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
};

function AdminLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(apiUrl('/api/admin-login.php'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        setError('Invalid admin username or password.');
        return;
      }

      const result = await response.json();
      if (!result.success) {
        setError(result.error || 'Login failed.');
        return;
      }
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setError('');
      onLogin();
    } catch (error) {
      setError('Unable to reach admin login. Check the PHP API setup.');
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-panel">
        <div className="admin-login-icon">
          <FiLock />
        </div>
        <h1>TurFlow Admin</h1>
        <p>Sign in to manage venues, photos, pricing and turf details.</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              name="username"
              type="text"
              value={credentials.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <button type="submit" className="admin-login-btn">
            <FiLogIn />
            <span>Sign In</span>
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;