export interface Building {
  id: string
  name: string
  slug: string
  address: string
  neighborhood: string
  corregimiento: string
  description?: string
  amenities?: string[]
  year_built?: number
  floors?: number
  apartments_count?: number
  parking?: boolean
  pool?: boolean
  gym?: boolean
  security_24_7?: boolean
  elevator?: boolean
  balcony?: boolean
  created_at?: string
  updated_at?: string
}

export interface Review {
  id: string
  building_id: string
  user_id: string
  rating: number
  comment: string
  // Ratings detalladas
  rating_building_condition?: number
  rating_security?: number
  rating_noise_level?: number
  rating_public_transport?: number
  rating_shopping_centers?: number
  rating_hospitals?: number
  rating_gym?: number
  rating_administration?: number
  rating_maintenance?: number
  rating_location?: number
  rating_apartment_quality?: number
  rating_amenities?: number
  // Información adicional
  review_title?: string
  pros?: string
  cons?: string
  living_duration_months?: number
  apartment_type?: 'studio' | '1br' | '2br' | '3br' | 'penthouse'
  monthly_rent_range?: 'under_500' | '500_1000' | '1000_1500' | '1500_2000' | '2000_3000' | 'over_3000'
  would_recommend?: boolean
  created_at?: string
  updated_at?: string
}

export interface User {
  id: string
  email: string
  created_at?: string
}

export interface Corregimiento {
  id: string
  name: string
  distrito: string
  active: boolean
  created_at?: string
}

export interface BuildingSuggestion {
  id: string
  name: string
  location: string
  email: string
  additional_info?: string
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  admin_notes?: string
  created_at?: string
  updated_at?: string
}

export interface BuildingRating {
  id: string
  name: string
  corregimiento: string
  total_reviews: number
  average_rating: number
  avg_building_condition?: number
  avg_security?: number
  avg_noise_level?: number
  avg_public_transport?: number
  avg_shopping_centers?: number
  avg_hospitals?: number
  avg_gym?: number
  avg_administration?: number
  avg_maintenance?: number
  avg_location?: number
  avg_apartment_quality?: number
  avg_amenities?: number
}

 