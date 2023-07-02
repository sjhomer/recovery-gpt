import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertUnixTimestampToDate = (timestamp: number, options?: Intl.DateTimeFormatOptions) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options
  })
}

export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000);
  return Math.ceil((firstDayOfYear.getDay() + pastDaysOfYear + 1) / 7);
}
