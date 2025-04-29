import { Platform } from 'react-native';

// Format the time for messages in a chat
export function formatMessageTime(timestamp: string): string {
  const messageDate = new Date(timestamp);
  const now = new Date();
  
  const isToday = messageDate.toDateString() === now.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === messageDate.toDateString();
  
  if (isToday) {
    return formatTime(messageDate);
  } else if (isYesterday) {
    return 'Yesterday';
  } else {
    return `${messageDate.getMonth() + 1}/${messageDate.getDate()}/${messageDate.getFullYear()}`;
  }
}

// Format time in 12-hour format
export function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${hours}:${formattedMinutes} ${ampm}`;
}

// Format relative time for "last active" status
export function formatLastActive(timestamp: string): string {
  const now = new Date();
  const lastActive = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - lastActive.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return lastActive.toLocaleDateString();
  }
}

// Platform-specific checks
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

// Calculate age from birthdate
export function calculateAge(birthdate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  
  return age;
}

// Format a distance in kilometers or miles
export function formatDistance(distanceInKm: number, useImperial: boolean = false): string {
  if (useImperial) {
    const miles = distanceInKm * 0.621371;
    return miles < 1 ? 'Less than a mile away' : `${Math.round(miles)} ${miles === 1 ? 'mile' : 'miles'} away`;
  } else {
    return distanceInKm < 1 ? 'Less than a km away' : `${Math.round(distanceInKm)} ${distanceInKm === 1 ? 'km' : 'kms'} away`;
  }
}

// Get a random item from an array
export function getRandomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}