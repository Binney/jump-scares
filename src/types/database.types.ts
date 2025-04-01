export type Room = {
  id: string;
  name: string;
  company: string;
  address: string;
  city: string;
  country: string;
  location: any; // PostGIS geometry type
  description: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
};

export type WarningType = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Review = {
  id: string;
  room_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
};

export type ReviewWarning = {
  id: string;
  review_id: string;
  room_id: string;
  warning_type_id: string;
  severity: number;
  timestamp: string | null;
  description: string | null;
  created_at: string;
};
