import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import './Profile.css';

const Profile = ({ onClose }) => {
  const { user, logout, requestPasswordReset, resetPassword } = useContext(UserContext);
  const [resetMode, setResetMode] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setPhone(user.phone);
    }
  }, [user]);

  const handleRequestReset = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    const result = await requestPasswordReset(phone);
    setLoading(false);
    if (result.success) {
      setMessage(result.message);
      setResetMode(true);
    } else {
      setError(result.error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const result = await resetPassword(phone, otp, newPassword);
    setLoading(false);
    if (result.success) {
      setMessage(result.message);
      setResetMode(false);
      setOtp('');
      setNewPassword('');
    } else {
      setError(result.error);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!user) return null;

  return (
    <div className="profile-modal">
      <div className="profile-container">
        <h2>Profile</h2>
        <div className="profile-details">
          <div className="detail-item">
            <label>Name:</label>
            <span>{user.firstName} {user.lastName}</span>
          </div>
          <div className="detail-item">
            <label>Phone:</label>
            <span>{user.phone}</span>
          </div>
          <div className="detail-item">
            <label>Email:</label>
            <span>{user.email || 'Not provided'}</span>
          </div>
        </div>
        {!resetMode ? (
          <div className="profile-actions">
            <button onClick={handleRequestReset} disabled={loading}>
              {loading ? 'Requesting...' : 'Reset Password'}
            </button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="reset-form">
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                placeholder="Contact admin to get OTP"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button type="button" onClick={() => setResetMode(false)}>Cancel</button>
          </form>
        )}
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Profile;
