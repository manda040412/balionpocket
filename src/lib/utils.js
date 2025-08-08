import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Ubah isLogin menjadi fungsi
export const isLogin = () => {
  return localStorage.getItem('authToken') ? true : false;
};