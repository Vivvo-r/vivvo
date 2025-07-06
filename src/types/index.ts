export interface Building {
  id: string
  name: string
  slug: string
  address: string
  neighborhood: string
  created_at?: string
}

export interface Review {
  id: string
  building_id: string
  user_id: string
  rating: number
  comment: string
  created_at?: string
}

export interface User {
  id: string
  email: string
  created_at?: string
} 