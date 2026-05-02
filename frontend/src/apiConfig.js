export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const apiUrl = (path) => `${API_BASE_URL}${path}`;

export const getAdminToken = () => sessionStorage.getItem('turflow_admin_token');

export const getAuthHeaders = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
