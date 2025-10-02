import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Ubah isLogin menjadi fungsi
export const isLogin = () => {
  return localStorage.getItem('authToken') ? true : false;
};

export const ucFirst = (str: string) => {
  if (!str) {
    return str; // Handle empty or null strings
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}