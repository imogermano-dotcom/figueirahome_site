export type Agent = {
  id: string;
  name: string;
  role: string | null;
  phone: string | null;
  email: string | null;
  photo_url: string | null;
};

export type PropertyImage = {
  id?: string;
  property_id?: string;
  url: string;
  alt: string;
  sort_order: number;
  is_primary: boolean;
};

export type Property = {
  id: string;
  slug: string;
  title: string;
  description: string;
  business: "comprar" | "arrendar" | "trespassar";
  type: string;
  location: string;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
  energy_certificate?: string | null;
  has_garage?: boolean;
  has_balcony?: boolean;
  map_location?: string | null;
  video_url?: string | null;
  status: string;
  featured: boolean;
  published: boolean;
  agent_id: string | null;
  created_at: string;
  updated_at: string;
  agent?: Agent | null;
  images?: PropertyImage[];
  floor_plans?: PropertyImage[];
};

export type PropertyFilters = {
  referencia?: string;
  negocio?: string;
  tipo?: string;
  localizacao?: string;
  preco_max?: string;
  quartos_min?: string;
  area_min?: string;
  ordem?: string;
};

export type LeadInput = {
  source: "form" | "chat" | "property_detail";
  name: string;
  email?: string;
  phone?: string;
  message: string;
  request_type: string;
  property_id?: string;
};
