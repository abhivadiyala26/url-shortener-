const API_BASE_URL = 'http://localhost:8080/api';

const api = {
    setToken(token) {
        localStorage.setItem('token', token);
    },
    
    getToken() {
        return localStorage.getItem('token');
    },

    removeToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 403 || response.status === 401) {
                    this.removeToken();
                    window.location.href = '/index.html';
                }
                throw new Error(data.message || data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    auth: {
        login: (credentials) => api.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),
        register: (userData) => api.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        })
    },

    url: {
        shorten: (data) => api.request('/url/shorten', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        getMyUrls: () => api.request('/url/my-urls', {
            method: 'GET'
        }),
        getDashboardStats: () => api.request('/url/dashboard-stats', {
            method: 'GET'
        })
    }
};
