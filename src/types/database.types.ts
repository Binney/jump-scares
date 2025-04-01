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
  room_warnings: {
    warning_type_id: string;
  }[];
};

export type WarningType = {
  id: string;
  name: string;
  description: string | null;
};

export type RoomWarning = {
  id: string;
  room_id: string;
  user_id: string;
  warning_type_id: string;
  severity: number;
  timestamp: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  warning_types?: WarningType;
};

export interface WarningWithWarningType extends WarningType {
  room_warnings: RoomWarning[];
}

export interface NewRoomWarning {
  room_id: string;
  user_id: string;
  warning_type_id: string;
  severity: number;
  description: string | null;
  created_at: string;
}
