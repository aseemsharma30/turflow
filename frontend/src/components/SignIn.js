import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './SignIn.css';

const SignIn = ({ onSwitchToSignup, onClose }) => {
  const { signin } = useContext(UserContext);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signin({ phone, password });
    setLoading(false);
    if (!result.success) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="auth-modal">
      <div className="auth-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p>
          Don't have an account?{' '}
          <button className="link-button" onClick={onSwitchToSignup}>
            Sign Up
          </button>
        </p>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default SignIn;
