// =============================================
// MMONARK DIGITAL — AUTH JS
// =============================================

// Demo credentials — replace with real backend auth
const ADMIN_EMAIL    = 'admin@mmonark.com';
const ADMIN_PASSWORD = 'admin2024';

function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl  = document.getElementById('login-error');

  errorEl.style.display = 'none';

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const user = { email, role: 'admin', name: 'Admin' };
    localStorage.setItem('mm_user', JSON.stringify(user));
    window.location.href = 'dashboard.html';
    return;
  }

  // Check registered users
  const users = JSON.parse(localStorage.getItem('mm_users') || '[]');
  const match = users.find(u => u.email === email && u.password === password);
  if (match) {
    const user = { email: match.email, role: 'client', name: match.name };
    localStorage.setItem('mm_user', JSON.stringify(user));
    window.location.href = 'dashboard.html';
    return;
  }

  errorEl.style.display = 'block';
}
