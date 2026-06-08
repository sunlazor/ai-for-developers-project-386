export interface BookingType {
    slug: string
    title: string
    description: string
    durationSlots: number
    active: boolean
}

export interface CreateBookingType {
    slug: string
    title: string
    description: string
    durationSlots: number
}

export interface UpdateBookingType {
    title?: string
    description?: string
}

export type SlotState = 'unavailable' | 'available' | 'booked'

export interface AvailableSlot {
    start: string
}

export interface HostSlot {
    start: string
    state: SlotState
}

export interface AvailabilityEdit {
    start: string
    state: 'available' | 'unavailable'
}

export interface Booking {
    id: string
    bookingTypeSlug: string
    startSlot: string
    visitorName: string
    visitorEmail: string
}

export interface CreateBooking {
    bookingTypeSlug: string
    startSlot: string
    visitorName: string
    visitorEmail: string
}

export interface ApiError {
    statusCode: number
    code: string
    message: string
}