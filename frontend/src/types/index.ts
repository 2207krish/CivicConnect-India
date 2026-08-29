export type Department =
  | "roads"
  | "electricity"
  | "sanitation"
  | "water"
  | "street_lights"
  | "garbage"
  | "drainage"
  | "parks"
  | "stray_animals"
  | "traffic"
  | "public_property";

export type CivicBodyType =
  | "municipal"
  | "electricity"
  | "water"
  | "pwd"
  | "traffic";

export interface Address {
  line1: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CivicBody {
  id: string;
  name: string;
  shortName: string;
  type: CivicBodyType;
  departments: Department[];
  address: string;
  city: string;
  state: string;
  pincode: string;
  pincodePrefixes: string[];
  email: string;
  phone: string;
  website?: string;
  lat: number;
  lng: number;
  officeHours: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  nearestBodyIds: string[];
  emailVerified: boolean;
  createdAt: string;
  /** Set when account was created or linked via Google OAuth */
  googleId?: string;
  /** Google profile picture URL */
  picture?: string;
}

export interface StoredUser extends PublicUser {
  /** Undefined for OAuth-only accounts (no password set) */
  salt?: string;
  /** Undefined for OAuth-only accounts (no password set) */
  passwordHash?: string;
}

export type ComplaintStatus =
  | "submitted"
  | "email_sent"
  | "acknowledged"
  | "in_progress"
  | "resolved"
  | "rejected";

export interface TimelineEvent {
  status: ComplaintStatus;
  at: string;
  note: string;
}

export interface ComplaintPhoto {
  name: string;
  url?: string;
  dataUrl?: string;
  bytes?: number;
}

export interface Complaint {
  id: string;
  trackingId: string;
  userId: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhone: string;
  categoryId: string;
  title: string;
  description: string;
  landmark?: string;
  photos: ComplaintPhoto[];
  address: Address;
  civicBodyId: string;
  civicBodyName: string;
  civicBodyEmail: string;
  status: ComplaintStatus;
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailDispatch {
  id: string;
  complaintId: string;
  trackingId: string;
  to: string;
  toName: string;
  subject: string;
  body: string;
  sentAt: string;
}

export interface MatchedCivicBody {
  body: CivicBody;
  score: number;
  distanceKm: number | null;
  matchReasons: string[];
}
