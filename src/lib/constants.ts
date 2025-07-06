export const VIVVO = {
  name: 'Vivvo',
  tagline: 'Vive mejor, decide mejor',
  description: 'Reviews de apartamentos en Panamá'
} as const

export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  buildings: '/buildings',
  building: (slug: string) => `/edificio/${slug}`,
  writeReview: (slug: string) => `/edificio/${slug}/review`,
  suggestBuilding: '/suggest-building',
} as const 