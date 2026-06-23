const API_URL = 'http://localhost:3001/api'

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'An error occurred' }))
    throw new Error(error.error || 'API request failed')
  }
  
  return res.json()
}

export const api = {
  health: () => fetchApi('/health'),
  
  products: {
    search: (query: string, page = 1) => fetchApi(`/products?q=${encodeURIComponent(query)}&page=${page}`),
    get: (id: number) => fetchApi(`/products/${id}`),
  },
  
  customers: {
    search: (query: string) => fetchApi(`/customers?q=${encodeURIComponent(query)}`),
    getInvoices: (id: number) => fetchApi(`/customers/${id}/invoices`),
  },
  
  dashboard: {
    getStats: () => fetchApi('/dashboard/stats'),
  },
  
  invoices: {
    getDaily: (date?: string) => fetchApi(date ? `/invoices?date=${date}` : '/invoices'),
    create: (data: any) => fetchApi('/invoices', { method: 'POST', body: JSON.stringify(data) }),
  },
  
  employees: {
    getAll: () => fetchApi('/employees'),
  }
}
