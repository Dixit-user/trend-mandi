"use client";

const PROFILE_ID_KEY = "trend-mandi-profile-id";

export function getStoredProfileId() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(PROFILE_ID_KEY) || "";
}

export function storeProfileId(profileId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_ID_KEY, profileId);
}
