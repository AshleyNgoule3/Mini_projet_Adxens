import { apiRequest } from './client'

export interface Features {
  ecritureActivee: boolean
}

export function getFeatures(): Promise<Features> {
  return apiRequest<Features>('/features')
}
