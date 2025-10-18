// src/lib/utils.ts

export const normalizeRoomType = (roomType?: string): string => {
  if (!roomType) return '';
  const t = String(roomType).toUpperCase();
  if (t === 'DORM') return 'HALL';
  return t;
};

export const displayRoomType = (roomType?: string): string => {
  const norm = normalizeRoomType(roomType);
  switch (norm) {
    case 'HALL':
      return 'Hall';
    case 'PRIVATE':
      return 'Private';
    default:
      // Fallback: humanize casing
      return norm.charAt(0) + norm.slice(1).toLowerCase();
  }
};

export default {
  normalizeRoomType,
  displayRoomType,
};
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
