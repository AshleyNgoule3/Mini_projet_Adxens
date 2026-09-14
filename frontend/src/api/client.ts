import type { ApiError } from '../types/employee'

// Chemin relatif par defaut : meme origine que le frontend. En dev, le proxy
// Vite (vite.config.ts) redirige /api vers le backend ; en docker-compose ou
// en production, /api est servi par la meme origine que la page. VITE_API_URL
// reste disponible pour surcharger ponctuellement (ex. pointer vers une autre
// API), mais n'est plus necessaire au fonctionnement normal.
const DEFAULT_API_BASE_URL = '/api'

function resolveApiBaseUrl(): string {
  const override = import.meta.env.VITE_API_URL
  return override && override.trim() !== '' ? override : DEFAULT_API_BASE_URL
}

export const API_BASE_URL = resolveApiBaseUrl()

export class ApiRequestError extends Error {
  readonly apiError: ApiError

  constructor(apiError: ApiError) {
    super(apiError.message)
    this.name = 'ApiRequestError'
    this.apiError = apiError
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  searchParams?: Record<string, string | number | undefined>
}

function buildUrl(path: string, searchParams?: RequestOptions['searchParams']): string {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(buildUrl(path, options.searchParams), {
    method: options.method ?? 'GET',
    headers: options.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiRequestError(
      (data as ApiError) ?? {
        timestamp: new Date().toISOString(),
        status: response.status,
        error: response.statusText,
        message: 'Une erreur inattendue est survenue.',
        path,
      },
    )
  }

  return data as T
}
