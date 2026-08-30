import type { PublicUser } from "@/types";

/**
 * Checks whether a citizen has completed the onboarding requirements
 * (valid phone number and complete residential address with PIN code).
 */
export function isProfileComplete(user: PublicUser | null | undefined): boolean {
  if (!user) return false;
  
  const hasPhone = Boolean(user.phone && user.phone.trim().length >= 10);
  const hasLine1 = Boolean(user.address?.line1 && user.address.line1.trim().length >= 3);
  const hasCity = Boolean(user.address?.city && user.address.city.trim().length >= 2);
  const hasPincode = Boolean(
    user.address?.pincode && /^[1-9][0-9]{5}$/.test(user.address.pincode.trim())
  );

  return hasPhone && hasLine1 && hasCity && hasPincode;
}
