// =============================================
// MMONARK DIGITAL — DASHBOARD JS
// =============================================

// ---- AUTH GUARD ----
const user = JSON.parse(localStorage.getItem('mm_user') || 'null');
if (!user) {
  window.location.href = 'login.html';
}

// ---- ADMIN EMAIL ----
const adminEmailEl = document.getElementById('admin-email');
if (adminEmailEl && user) {
  adminEmailEl.textContent = `Admin: ${user.email}`;
}

function logout() {
  localStorage.removeItem('mm_user');
  window.location.href = 'login.html';
}

// ---- TABS ----
function showTab(name, btn) {
  document.querySelectorAll('.dash-panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).classList.remove('hidden');
  btn.classList.add('active');
}

// ---- LOAD DATA ----
function loadDashboard() {
  const projects  = JSON.parse(localStorage.getItem('mm_projects')  || '[]');
  const users     = JSON.parse(localStorage.getItem('mm_users')     || '[]');
  const inquiries = JSON.parse(localStorage.getItem('mm_inquiries') || '[]');

  const pending   = projects.filter(p => p.status === 'Pending').length;
  const active    = projects.filter(p => p.status === 'Active').length;
  const completed = projects.filter(p => p.status === 'Completed').length;

  document.getElementById('stat-users').textContent     = users.length;
  document.getElementById('stat-projects').textContent  = projects.length;
  document.getElementById('stat-pending').textContent   = pending;
  document.getElementById('stat-active').textContent    = active;
  document.getElementById('stat-completed').textContent = completed;

  // Recent users
  const recentUsersEl = document.getElementById('recent-users-list');
  if (users.length === 0) {
    recentUsersEl.innerHTML = '<p class="dash-empty">No users yet.</p>';
  } else {
    recentUsersEl.innerHTML = users.slice(0, 5).map(u => `
      <div class="dash-list-item">
        <span>${u.name}</span>
        <span style="color:var(--muted);font-size:0.72rem">${u.email}</span>
      </div>`).join('');
  }

  // Recent projects
  const recentProjectsEl = document.getElementById('recent-projects-list');
  if (projects.length === 0) {
    recentProjectsEl.innerHTML = '<p class="dash-empty">No projects yet.</p>';
  } else {
    recentProjectsEl.innerHTML = projects.slice(0, 5).map(p => `
      <div class="dash-list-item">
        <span>${p.client}</span>
        <span class="status-badge status-${p.status.toLowerCase()}">${p.status}</span>
      </div>`).join('');
  }

  // Projects table
  const tbody = document.getElementById('projects-tbody');
  if (projects.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="dash-empty">No projects yet.</td></tr>';
  } else {
    tbody.innerHTML = projects.map((p, i) => `
      <tr>
        <td>${p.client}</td>
        <td>${p.service}</td>
        <td><span class="status-badge status-${p.status.toLowerCase()}">${p.status}</span></td>
        <td>${p.date}</td>
        <td>
          <button class="btn-outline" style="font-size:0.6rem;padding:0.3rem 0.7rem" onclick="deleteProject(${i})">Delete</button>
        </td>
      </tr>`).join('');
  }

  // Users table
  const usersTbody = document.getElementById('users-tbody');
  if (users.length === 0) {
    usersTbody.innerHTML = '<tr><td colspan="4" class="dash-empty">No users yet.</td></tr>';
  } else {
    usersTbody.innerHTML = users.map(u => `
      <tr>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td><span class="status-badge status-active">${u.role || 'client'}</span></td>
        <td>${u.date || '—'}</td>
      </tr>`).join('');
  }

  // Inquiries
  const inquiriesEl = document.getElementById('inquiries-list');
  if (inquiries.length === 0) {
    inquiriesEl.innerHTML = '<p class="dash-empty">No inquiries yet.</p>';
  } else {
    inquiriesEl.innerHTML = inquiries.map(inq => `
      <div class="dash-list-item" style="flex-direction:column;align-items:flex-start;gap:0.4rem">
        <div style="display:flex;justify-content:space-between;width:100%">
          <strong>${inq.name}</strong>
          <span style="color:var(--muted);font-size:0.7rem">${inq.date}</span>
        </div>
        <span style="color:var(--muted);font-size:0.75rem">${inq.email}${inq.phone ? ' · ' + inq.phone : ''}</span>
        ${inq.services && inq.services.length ? `<span style="color:var(--gold);font-size:0.68rem">${inq.services.join(', ')}</span>` : ''}
        ${inq.message ? `<p style="font-size:0.78rem;color:var(--muted);margin-top:0.2rem">${inq.message}</p>` : ''}
      </div>`).join('');
  }
}

// ---- ADD PROJECT ----
function openAddProject() {
  document.getElementById('add-project-modal').classList.remove('hidden');
  document.getElementById('add-project-modal').classList.add('open');
}
function closeAddProject() {
  document.getElementById('add-project-modal').classList.remove('open');
  setTimeout(() => document.getElementById('add-project-modal').classList.add('hidden'), 300);
}

function addProject(e) {
  e.preventDefault();
  const projects = JSON.parse(localStorage.getItem('mm_projects') || '[]');
  projects.unshift({
    client:  document.getElementById('proj-client').value,
    service: document.getElementById('proj-service').value,
    status:  document.getElementById('proj-status').value,
    date:    new Date().toLocaleDateString('en-CA')
  });
  localStorage.setItem('mm_projects', JSON.stringify(projects));
  closeAddProject();
  loadDashboard();
}

function deleteProject(index) {
  if (!confirm('Delete this project?')) return;
  const projects = JSON.parse(localStorage.getItem('mm_projects') || '[]');
  projects.splice(index, 1);
  localStorage.setItem('mm_projects', JSON.stringify(projects));
  loadDashboard();
}

// Init
loadDashboard();
