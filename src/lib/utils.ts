import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatSlotStart(slotStart: string): Date {
    return new Date(slotStart)
}

export function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
    })
}

export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    })
}

export function formatDateShort(date: Date): string {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
    })
}

export function getWeekRange(): { start: Date; end: Date } {
    const now = new Date()
    const day = now.getUTCDay()
    const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(now.setUTCDate(diff))
    monday.setUTCHours(0, 0, 0, 0)
    const sunday = new Date(monday)
    sunday.setUTCDate(monday.getUTCDate() + 6)
    sunday.setUTCHours(23, 59, 59, 999)
    return {start: monday, end: sunday}
}

export function generateSlotStarts(start: Date, end: Date): string[] {
    const slots: string[] = []
    const current = new Date(start)
    current.setUTCMinutes(0, 0, 0)
    while (current <= end) {
        const minutes = current.getUTCMinutes()
        const roundedMinutes = Math.floor(minutes / 15) * 15
        current.setUTCMinutes(roundedMinutes, 0, 0)
        slots.push(current.toISOString())
        current.setUTCMinutes(current.getUTCMinutes() + 15)
    }
    return slots
}