const BACKEND_BASE_URL = 'http://localhost:8080';

// Toast Notification Helper
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if(!toast) return;
    
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Show/Hide Error
function showError(message) {
    const errorEl = document.getElementById('auth-error');
    if(!errorEl) return;
    
    errorEl.textContent = message;
    errorEl.classList.remove('d-none');
}

// Toggle Loader in Buttons
function toggleLoader(btnId, isLoading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    
    const span = btn.querySelector('span');
    const loader = btn.querySelector('.loader');
    
    if (isLoading) {
        btn.disabled = true;
        span.classList.add('d-none');
        loader.classList.remove('d-none');
    } else {
        btn.disabled = false;
        span.classList.remove('d-none');
        loader.classList.add('d-none');
    }
}

// Auth Tabs Logic
document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
                document.getElementById(`${btn.dataset.target}-form`).classList.add('active');
                
                const errorEl = document.getElementById('auth-error');
                if(errorEl) errorEl.classList.add('d-none');
            });
        });
    }
});

// Login Handler
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        toggleLoader('login-btn', true);
        const res = await api.auth.login({ username, password });
        api.setToken(res.token);
        localStorage.setItem('username', res.username);
        window.location.href = '/dashboard.html';
    } catch (err) {
        showError(err.message || 'Login failed');
    } finally {
        toggleLoader('login-btn', false);
    }
}

// Signup Handler
async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    try {
        toggleLoader('signup-btn', true);
        const res = await api.auth.register({ username, email, password });
        api.setToken(res.token);
        localStorage.setItem('username', res.username);
        window.location.href = '/dashboard.html';
    } catch (err) {
        showError(err.message || 'Signup failed');
    } finally {
        toggleLoader('signup-btn', false);
    }
}

// Logout Handler
function handleLogout() {
    api.removeToken();
    window.location.href = '/index.html';
}

// Dashboard Logic
async function loadDashboardData() {
    try {
        // Load Stats
        const stats = await api.url.getDashboardStats();
        document.getElementById('total-links').textContent = stats.totalLinks || 0;
        document.getElementById('total-clicks').textContent = stats.totalClicks || 0;
        
        // Load Links
        loadLinksTable();
    } catch (err) {
        showToast('Failed to load dashboard data', 'error');
    }
}

async function loadLinksTable() {
    const loader = document.getElementById('table-loader');
    const emptyState = document.getElementById('empty-state');
    const tbody = document.getElementById('links-table-body');
    
    loader.classList.remove('d-none');
    
    try {
        const urls = await api.url.getMyUrls();
        tbody.innerHTML = '';
        
        if (urls.length === 0) {
            emptyState.classList.remove('d-none');
        } else {
            emptyState.classList.add('d-none');
            
            urls.forEach(url => {
                const tr = document.createElement('tr');
                const shortUrlFull = `${BACKEND_BASE_URL}/${url.shortUrl}`;
                const date = new Date(url.createdAt).toLocaleDateString();
                
                tr.innerHTML = `
                    <td class="td-original-url" title="${url.originalUrl}">${url.originalUrl}</td>
                    <td class="td-short-url"><a href="${shortUrlFull}" target="_blank">${url.shortUrl}</a></td>
                    <td><span class="badge">${url.clickCount}</span></td>
                    <td>${date}</td>
                    <td>
                        <button class="btn btn-icon" onclick="copyText('${shortUrlFull}')" title="Copy">
                            <i class='bx bx-copy'></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (err) {
        showToast('Failed to load links', 'error');
    } finally {
        loader.classList.add('d-none');
    }
}

async function handleShorten(e) {
    e.preventDefault();
    const originalUrl = document.getElementById('long-url').value;
    const customAlias = document.getElementById('custom-alias').value;
    
    try {
        toggleLoader('shorten-btn', true);
        const res = await api.url.shorten({ originalUrl, customAlias });
        
        const shortUrlFull = `${BACKEND_BASE_URL}/${res.shortUrl}`;
        const resultDiv = document.getElementById('shorten-result');
        const shortLinkText = document.getElementById('short-url-link');
        
        shortLinkText.href = shortUrlFull;
        shortLinkText.textContent = shortUrlFull;
        resultDiv.classList.remove('d-none');
        
        document.getElementById('long-url').value = '';
        document.getElementById('custom-alias').value = '';
        
        showToast('Link shortened successfully!');
        
        // Reload data
        loadDashboardData();
    } catch (err) {
        showToast(err.message || 'Failed to shorten URL', 'error');
    } finally {
        toggleLoader('shorten-btn', false);
    }
}

function copyToClipboard() {
    const text = document.getElementById('short-url-link').textContent;
    copyText(text);
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}
