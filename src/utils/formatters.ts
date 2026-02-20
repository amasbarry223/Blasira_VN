import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format a date to French format
 * @param date - Date to format
 * @param formatStr - Format string (default: 'dd/MM/yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: fr });
}

/**
 * Format a date with time
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy à HH:mm', { locale: fr });
}

/**
 * Format relative time (e.g., "il y a 2 heures")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: fr });
}

/**
 * Format price in FCFA
 * @param price - Price in FCFA
 * @returns Formatted price string (e.g., "15 000 FCFA")
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA';
}

/**
 * Format phone number in Malian format (+223 XX XX XX XX)
 * @param phone - Phone number (8 digits)
 * @returns Formatted phone string
 */
export function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it's 8 digits, format as +223 XX XX XX XX
  if (cleaned.length === 8) {
    return `+223 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)}`;
  }
  
  // If it already has +223, return as is
  if (phone.startsWith('+223')) {
    return phone;
  }
  
  // Otherwise return cleaned version
  return phone;
}

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}

/**
 * Format percentage
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimals (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

