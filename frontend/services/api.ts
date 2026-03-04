const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

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

// ─── Image compression ──────────────────────────────────────────────────────
// Per-image strategy (each file is checked independently):
//   ≤ 500 KB → returned as-is, zero quality loss
//   > 500 KB → Pass 1: resize to max 1400 px at 85 % quality
//              Pass 2: only if still > 500 KB → re-encode at 72 %

const PER_IMAGE_THRESHOLD = 500 * 1024; // 500 KB

function _resizeAndEncode(
  img: HTMLImageElement,
  maxPx: number,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width  = Math.round(img.width  * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
  });
}

function compressImage(file: File): Promise<File> {
  // ✅ Already small — upload original untouched
  if (file.size <= PER_IMAGE_THRESHOLD) return Promise.resolve(file);

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = async () => {
      URL.revokeObjectURL(url);
      const outName = file.name.replace(/\.[^.]+$/, '.jpg');
      // Pass 1 — 1400 px, 85 % quality
      let blob = await _resizeAndEncode(img, 1400, 0.85);
      // Pass 2 — only triggered when pass 1 result is still large
      if (blob && blob.size > PER_IMAGE_THRESHOLD) {
        blob = await _resizeAndEncode(img, 1400, 0.72);
      }
      resolve(blob ? new File([blob], outName, { type: 'image/jpeg' }) : file);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
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

    if (imageFiles && imageFiles.length > 0) {
      const compressed = await Promise.all(imageFiles.map(compressImage));
      compressed.forEach((file) => formData.append('images', file));
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

    if (imageFiles && imageFiles.length > 0) {
      const compressed = await Promise.all(imageFiles.map(compressImage));
      compressed.forEach((file) => formData.append('images', file));
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

// ─── Settings API ───────────────────────────────────────────────────────────
export interface UserSettings {
  phone: string;
  isDeactivated: boolean;
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
      adStatusAlerts: boolean;
      messageAlerts: boolean;
      marketingEmails: boolean;
    };
    privacy: {
      publicProfile: boolean;
      showPhone: boolean;
      appOnlyContact: boolean;
    };
    language: 'en' | 'fr' | 'ar';
    defaultWilaya: string;
    theme: 'light' | 'dark' | 'system';
    defaultCategory: string;
  };
}

export const settingsAPI = {
  /** Fetch all settings for the current user */
  async get(): Promise<UserSettings> {
    return apiFetch('/settings');
  },

  /** Update settings (partial update — send only changed fields) */
  async update(data: {
    phone?: string;
    settings?: Partial<UserSettings['settings']>;
  }) {
    return apiFetch('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /** Change password */
  async changePassword(currentPassword: string, newPassword: string) {
    return apiFetch('/settings/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  /** Update phone number */
  async updatePhone(phone: string) {
    return apiFetch('/settings/phone', {
      method: 'PUT',
      body: JSON.stringify({ phone }),
    });
  },

  /** Deactivate account */
  async deactivate() {
    return apiFetch('/settings/deactivate', { method: 'POST' });
  },

  /** Reactivate account */
  async reactivate() {
    return apiFetch('/settings/reactivate', { method: 'POST' });
  },

  /** Permanently delete account and all data */
  async deleteAccount() {
    return apiFetch('/settings/account', { method: 'DELETE' });
  },
};

export interface TermsSection {
  heading: string;
  body: string;
}

export interface TermsOfServiceResponse {
  title: string;
  version: string;
  lastUpdated: string;
  sections: TermsSection[];
}

export interface AboutStat {
  label: string;
  value: string;
}

export interface AboutSection {
  heading: string;
  body: string;
}

export interface AboutResponse {
  title: string;
  subtitle: string;
  stats: AboutStat[];
  sections: AboutSection[];
}

export const legalAPI = {
  async getTerms(): Promise<TermsOfServiceResponse> {
    return apiFetch('/legal/terms');
  },

  async getAbout(): Promise<AboutResponse> {
    return apiFetch('/legal/about');
  },
};
