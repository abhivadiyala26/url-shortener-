const BACKEND_BASE_URL = window.location.origin;

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
    
    const errorText = document.getElementById('error-text');
    if (errorText) {
        errorText.textContent = message;
    } else {
        errorEl.textContent = message;
    }
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

// DOM Content Loaded Handler (Routing, Search, and Password Strength listeners)
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    // Client-side authentication routing guard
    if (path.includes('dashboard.html')) {
        if (!api.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        } else {
            // Display username in dashboard navbar
            const usernameDisplay = document.getElementById('username-display');
            if (usernameDisplay) {
                usernameDisplay.textContent = localStorage.getItem('username') || 'User';
            }
            loadDashboardData();

            // Attach search input listener
            const searchInput = document.getElementById('search-links');
            if (searchInput) {
                searchInput.addEventListener('input', filterLinks);
            }
        }
    } else if (path.includes('login.html') || path.includes('signup.html')) {
        if (api.isAuthenticated()) {
            window.location.href = 'dashboard.html';
            return;
        }

        // Attach password strength meter listener (if on signup page)
        const passwordInput = document.getElementById('signup-password');
        if (passwordInput) {
            const strengthContainer = document.getElementById('password-strength-container');
            const strengthFill = document.getElementById('strength-meter-fill');
            const strengthLabel = document.getElementById('strength-meter-label');
            
            passwordInput.addEventListener('input', () => {
                const val = passwordInput.value;
                if (!val) {
                    strengthContainer.classList.add('d-none');
                    return;
                }
                
                strengthContainer.classList.remove('d-none');
                
                let score = 0;
                if (val.length >= 8) score++;
                if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++;
                if (/\d/.test(val)) score++;
                if (/[^A-Za-z0-9]/.test(val)) score++;
                
                strengthFill.className = 'strength-meter-fill';
                strengthLabel.className = 'strength-meter-label';
                
                if (score <= 1) {
                    strengthFill.classList.add('weak');
                    strengthLabel.classList.add('weak');
                    strengthLabel.textContent = 'Weak (Needs 8+ chars with upper, lower & digit)';
                } else if (score === 2 || score === 3) {
                    strengthFill.classList.add('medium');
                    strengthLabel.classList.add('medium');
                    strengthLabel.textContent = 'Medium (Good password)';
                } else {
                    strengthFill.classList.add('strong');
                    strengthLabel.classList.add('strong');
                    strengthLabel.textContent = 'Strong (Very secure)';
                }
            });
        }
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
                
                // Expiry processing
                let expiryHtml = '<span class="td-expiry none">No Expiry</span>';
                if (url.expiresAt) {
                    const isExpired = new Date(url.expiresAt) < new Date();
                    const expiryDateStr = new Date(url.expiresAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
                    if (isExpired) {
                        expiryHtml = `<span class="td-expiry expired"><i class="bx bx-calendar-x"></i> Expired</span>`;
                    } else {
                        expiryHtml = `<span class="td-expiry active" title="Expires at ${expiryDateStr}"><i class="bx bx-calendar-check"></i> ${new Date(url.expiresAt).toLocaleDateString()}</span>`;
                    }
                }
                
                tr.innerHTML = `
                    <td class="td-original-url" title="${url.originalUrl}">${url.originalUrl}</td>
                    <td class="td-short-url"><a href="${shortUrlFull}" target="_blank">${url.shortUrl}</a></td>
                    <td>${expiryHtml}</td>
                    <td><span class="badge">${url.clickCount}</span></td>
                    <td>${date}</td>
                    <td>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-icon" onclick="copyText('${shortUrlFull}')" title="Copy URL">
                                <i class='bx bx-copy'></i>
                            </button>
                            <button class="btn btn-icon" onclick="openQrModal('${shortUrlFull}')" title="Generate QR Code">
                                <i class='bx bx-qr-scan'></i>
                            </button>
                            <button class="btn btn-icon" onclick="handleDeleteUrl('${url.shortUrl}')" title="Delete URL" style="color: var(--danger); border-color: rgba(239,68,68,0.15);">
                                <i class='bx bx-trash'></i>
                            </button>
                        </div>
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
    const expiresAtInput = document.getElementById('expires-at').value;
    
    // Parse expiry date if selected
    const expiresAt = expiresAtInput ? expiresAtInput : null;
    
    try {
        toggleLoader('shorten-btn', true);
        const res = await api.url.shorten({ originalUrl, customAlias, expiresAt });
        
        const shortUrlFull = `${BACKEND_BASE_URL}/${res.shortUrl}`;
        const resultDiv = document.getElementById('shorten-result');
        const shortLinkText = document.getElementById('short-url-link');
        
        shortLinkText.href = shortUrlFull;
        shortLinkText.textContent = shortUrlFull;
        resultDiv.classList.remove('d-none');
        
        document.getElementById('long-url').value = '';
        document.getElementById('custom-alias').value = '';
        document.getElementById('expires-at').value = '';
        
        showToast('Link shortened successfully!');
        
        // Reload data
        loadDashboardData();
    } catch (err) {
        showToast(err.message || 'Failed to shorten URL', 'error');
    } finally {
        toggleLoader('shorten-btn', false);
    }
}

// Delete Handler
async function handleDeleteUrl(shortCode) {
    if (!confirm('Are you sure you want to delete this shortened URL? This action cannot be undone.')) {
        return;
    }
    
    try {
        await api.url.deleteUrl(shortCode);
        showToast('URL deleted successfully');
        loadDashboardData();
    } catch (err) {
        showToast(err.message || 'Failed to delete URL', 'error');
    }
}

// QR Code Modal Controls
function openQrModal(url) {
    const modal = document.getElementById('qr-modal');
    const img = document.getElementById('qr-code-img');
    if (modal && img) {
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;
        modal.classList.remove('d-none');
    }
}

function closeQrModal() {
    const modal = document.getElementById('qr-modal');
    if (modal) {
        modal.classList.add('d-none');
    }
}

// Search Filter
function filterLinks() {
    const query = document.getElementById('search-links').value.toLowerCase();
    const tbody = document.getElementById('links-table-body');
    if (!tbody) return;
    
    const rows = tbody.getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const originalUrl = row.cells[0].textContent.toLowerCase();
        const shortUrl = row.cells[1].textContent.toLowerCase();
        
        if (originalUrl.includes(query) || shortUrl.includes(query)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
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

function toggleAdvancedOptions() {
    const adv = document.getElementById('advanced-options');
    const chev = document.getElementById('advanced-chevron');
    if (adv && chev) {
        adv.classList.toggle('d-none');
        if (adv.classList.contains('d-none')) {
            chev.className = 'bx bx-chevron-down';
        } else {
            chev.className = 'bx bx-chevron-up';
        }
    }
}

function togglePasswordVisibility(inputId, toggleEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        toggleEl.className = 'bx bx-show password-toggle';
    } else {
        input.type = 'password';
        toggleEl.className = 'bx bx-hide password-toggle';
    }
}
