const API_BASE = '/api';

// ─── Token helpers ──────────────────────────────────────────────────────────
function getToken(): string | null {
  return localStorage.getItem('daberli_token');
}

function setToken(token: string) {
  localStorage.setItem('daberli_token', token);
}

function removeToken() {
  localStorage.removeItem('daberli_token');
}

// ─── Generic fetch wrapper ──────────────────────────────────────────────────
async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type for non-FormData bodies
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return res.json();
}

// ─── Auth API ───────────────────────────────────────────────────────────────
export const authAPI = {
  async register(name: string, email: string, password: string) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setToken(data.token);
    return data;
  },

  async login(email: string, password: string) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  async getMe() {
    return apiFetch('/auth/me');
  },

  async updateProfile(updates: { name?: string; email?: string }) {
    return apiFetch('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiFetch('/auth/avatar', {
      method: 'POST',
      body: formData,
    });
  },

  logout() {
    removeToken();
  },

  isLoggedIn() {
    return !!getToken();
  },
};

// ─── Ads API ────────────────────────────────────────────────────────────────
export const adsAPI = {
  async getAll(params?: {
    category?: string;
    location?: string;
    q?: string;
    userId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val) searchParams.set(key, val);
      });
    }
    const qs = searchParams.toString();
    return apiFetch(`/ads${qs ? `?${qs}` : ''}`);
  },

  async getById(id: string) {
    return apiFetch(`/ads/${id}`);
  },

  async create(adData: any, imageFiles?: File[]) {
    const formData = new FormData();
    formData.append('title', adData.title);
    formData.append('category', adData.category);
    formData.append('price', String(adData.price));
    formData.append('currency', adData.currency || 'DZD');
    formData.append('location', adData.location);

    if (adData.details) {
      formData.append('details', JSON.stringify(adData.details));
    }

    if (imageFiles) {
      imageFiles.forEach((file) => formData.append('images', file));
    }

    return apiFetch('/ads', {
      method: 'POST',
      body: formData,
    });
  },

  async update(id: string, adData: any, imageFiles?: File[]) {
    const formData = new FormData();
    if (adData.title) formData.append('title', adData.title);
    if (adData.category) formData.append('category', adData.category);
    if (adData.price) formData.append('price', String(adData.price));
    if (adData.currency) formData.append('currency', adData.currency);
    if (adData.location) formData.append('location', adData.location);
    if (adData.details) formData.append('details', JSON.stringify(adData.details));

    if (imageFiles) {
      imageFiles.forEach((file) => formData.append('images', file));
    }

    return apiFetch(`/ads/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },

  async delete(id: string) {
    return apiFetch(`/ads/${id}`, { method: 'DELETE' });
  },

  async approve(id: string) {
    return apiFetch(`/ads/${id}/approve`, { method: 'PUT' });
  },

  async reject(id: string) {
    return apiFetch(`/ads/${id}/reject`, { method: 'PUT' });
  },
};

// ─── Messages API ───────────────────────────────────────────────────────────
export const messagesAPI = {
  async getByAd(adId: string) {
    return apiFetch(`/messages/${adId}`);
  },

  async getAll() {
    return apiFetch('/messages');
  },

  async send(adId: string, text: string, senderRole: 'buyer' | 'owner' = 'buyer') {
    return apiFetch('/messages', {
      method: 'POST',
      body: JSON.stringify({ adId, text, senderRole }),
    });
  },
};

// ─── Upload API ─────────────────────────────────────────────────────────────
export const uploadAPI = {
  async uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return apiFetch('/upload', {
      method: 'POST',
      body: formData,
    });
  },
};
