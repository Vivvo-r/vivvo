export interface Building {
  id: string
  name: string
  slug: string
  address: string
  corregimiento: string
  description?: string
  amenities?: string[]
  year_built?: number
  floors?: number
  apartments_count?: number
  // Developer/Constructor info
  developer?: string
  // Photo management
  photos?: string[] // URLs de las fotos
  main_photo?: string // URL de la foto principal
  // Amenities
  parking?: boolean
  pool?: boolean
  gym?: boolean
  security_24_7?: boolean
  elevator?: boolean
  balcony?: boolean
  // Additional amenities
  playground?: boolean
  social_area?: boolean
  concierge?: boolean
  // Count fields
  elevator_count?: number
  pool_count?: number
  // Calculated fields (from reviews)
  average_rating?: number
  total_reviews?: number
  created_at?: string
  updated_at?: string
}

export interface Review {
  id: string
  building_id: string
  user_id: string
  overall_rating: number // Rating principal (1-5)
  comment: string
  // Ratings detalladas (1-5)
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
  building_name: string
  building_address: string
  corregimiento: string
  submitter_email: string
  submitter_name?: string
  additional_info?: string
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  admin_notes?: string
  // Campos opcionales de info del edificio
  developer?: string
  year_built?: number
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

 