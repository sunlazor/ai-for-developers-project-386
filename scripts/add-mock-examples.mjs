import {readFileSync, writeFileSync} from 'node:fs';
import yaml from 'js-yaml';

const OPENAPI_PATH = 'tsp-output/openapi/openapi.yaml';

const spec = yaml.load(readFileSync(OPENAPI_PATH, 'utf8'));

// --- Booking Types ---
const bookingTypes = [
    {
        slug: 'intro-call',
        title: 'Intro Call',
        description: 'A quick 30-minute introductory call to discuss your needs.',
        durationSlots: 2,
        active: true
    },
    {
        slug: 'deep-dive',
        title: 'Deep Dive Session',
        description: 'A 60-minute deep dive into your project requirements.',
        durationSlots: 4,
        active: true
    },
    {
        slug: 'quick-chat',
        title: 'Quick Chat',
        description: 'A brief 15-minute chat for quick questions.',
        durationSlots: 1,
        active: true
    },
    {
        slug: 'workshop',
        title: 'Workshop',
        description: 'A 90-minute hands-on workshop session.',
        durationSlots: 6,
        active: false
    },
];

// --- Available Slots (Visitor view) ---
// Free blocks of different sizes for different booking types
const availableSlots = [
    // Tue 2026-06-09 — 60min block (09:00-10:00) + isolated 15min (10:15)
    {start: '2026-06-09T09:00:00Z'},
    {start: '2026-06-09T09:15:00Z'},
    {start: '2026-06-09T09:30:00Z'},
    {start: '2026-06-09T09:45:00Z'},
    {start: '2026-06-09T10:15:00Z'},
    // Wed 2026-06-10 — 30min block (14:00-14:30) + 60min block (15:00-15:45)
    {start: '2026-06-10T14:00:00Z'},
    {start: '2026-06-10T14:15:00Z'},
    {start: '2026-06-10T15:00:00Z'},
    {start: '2026-06-10T15:15:00Z'},
    {start: '2026-06-10T15:30:00Z'},
    {start: '2026-06-10T15:45:00Z'},
    // Thu 2026-06-11 — 60min block (10:00-10:45)
    {start: '2026-06-11T10:00:00Z'},
    {start: '2026-06-11T10:15:00Z'},
    {start: '2026-06-11T10:30:00Z'},
    {start: '2026-06-11T10:45:00Z'},
    // Fri 2026-06-12 — 15min (13:00) + 60min (14:00-14:45)
    {start: '2026-06-12T13:00:00Z'},
    {start: '2026-06-12T14:00:00Z'},
    {start: '2026-06-12T14:15:00Z'},
    {start: '2026-06-12T14:30:00Z'},
    {start: '2026-06-12T14:45:00Z'},
    // Mon 2026-06-15 — 60min block (09:00-09:45)
    {start: '2026-06-15T09:00:00Z'},
    {start: '2026-06-15T09:15:00Z'},
    {start: '2026-06-15T09:30:00Z'},
    {start: '2026-06-15T09:45:00Z'},
    // Tue 2026-06-16 — 45min block (09:00-09:30) + isolated 15min (10:00)
    {start: '2026-06-16T09:00:00Z'},
    {start: '2026-06-16T09:15:00Z'},
    {start: '2026-06-16T09:30:00Z'},
    {start: '2026-06-16T10:00:00Z'},
    // Wed 2026-06-17 — 60min block (14:00-14:45)
    {start: '2026-06-17T14:00:00Z'},
    {start: '2026-06-17T14:15:00Z'},
    {start: '2026-06-17T14:30:00Z'},
    {start: '2026-06-17T14:45:00Z'},
];

// --- Host Slots (with states) ---
const hostSlots = [
    // Tue 2026-06-09
    {start: '2026-06-09T09:00:00Z', state: 'available'},
    {start: '2026-06-09T09:15:00Z', state: 'available'},
    {start: '2026-06-09T09:30:00Z', state: 'available'},
    {start: '2026-06-09T09:45:00Z', state: 'available'},
    {start: '2026-06-09T10:00:00Z', state: 'unavailable'},
    {start: '2026-06-09T10:15:00Z', state: 'available'},
    {start: '2026-06-09T10:30:00Z', state: 'booked'},
    {start: '2026-06-09T10:45:00Z', state: 'booked'},
    // Wed 2026-06-10
    {start: '2026-06-10T14:00:00Z', state: 'available'},
    {start: '2026-06-10T14:15:00Z', state: 'available'},
    {start: '2026-06-10T14:30:00Z', state: 'unavailable'},
    {start: '2026-06-10T14:45:00Z', state: 'unavailable'},
    {start: '2026-06-10T15:00:00Z', state: 'available'},
    {start: '2026-06-10T15:15:00Z', state: 'available'},
    {start: '2026-06-10T15:30:00Z', state: 'available'},
    {start: '2026-06-10T15:45:00Z', state: 'available'},
    // Thu 2026-06-11
    {start: '2026-06-11T10:00:00Z', state: 'available'},
    {start: '2026-06-11T10:15:00Z', state: 'available'},
    {start: '2026-06-11T10:30:00Z', state: 'available'},
    {start: '2026-06-11T10:45:00Z', state: 'available'},
    // Fri 2026-06-12
    {start: '2026-06-12T13:00:00Z', state: 'available'},
    {start: '2026-06-12T13:15:00Z', state: 'unavailable'},
    {start: '2026-06-12T13:30:00Z', state: 'unavailable'},
    {start: '2026-06-12T13:45:00Z', state: 'unavailable'},
    {start: '2026-06-12T14:00:00Z', state: 'booked'},
    {start: '2026-06-12T14:15:00Z', state: 'booked'},
    {start: '2026-06-12T14:30:00Z', state: 'booked'},
    {start: '2026-06-12T14:45:00Z', state: 'booked'},
    // Mon 2026-06-15
    {start: '2026-06-15T09:00:00Z', state: 'available'},
    {start: '2026-06-15T09:15:00Z', state: 'available'},
    {start: '2026-06-15T09:30:00Z', state: 'available'},
    {start: '2026-06-15T09:45:00Z', state: 'available'},
    // Tue 2026-06-16
    {start: '2026-06-16T09:00:00Z', state: 'available'},
    {start: '2026-06-16T09:15:00Z', state: 'available'},
    {start: '2026-06-16T09:30:00Z', state: 'available'},
    {start: '2026-06-16T09:45:00Z', state: 'unavailable'},
    {start: '2026-06-16T10:00:00Z', state: 'available'},
    {start: '2026-06-16T10:15:00Z', state: 'unavailable'},
    {start: '2026-06-16T10:30:00Z', state: 'unavailable'},
    {start: '2026-06-16T10:45:00Z', state: 'unavailable'},
    // Wed 2026-06-17
    {start: '2026-06-17T14:00:00Z', state: 'available'},
    {start: '2026-06-17T14:15:00Z', state: 'available'},
    {start: '2026-06-17T14:30:00Z', state: 'available'},
    {start: '2026-06-17T14:45:00Z', state: 'available'},
];

// --- Bookings ---
const bookings = [
    {
        id: '2026-06-09-10-30',
        bookingTypeSlug: 'intro-call',
        startSlot: '2026-06-09T10:30:00Z',
        visitorName: 'Alice Johnson',
        visitorEmail: 'alice@example.com'
    },
    {
        id: '2026-06-12-14-00',
        bookingTypeSlug: 'deep-dive',
        startSlot: '2026-06-12T14:00:00Z',
        visitorName: 'Bob Smith',
        visitorEmail: 'bob@example.com'
    },
];

// Inject examples into responses
const paths = spec.paths;

// GET /booking-types
if (paths['/booking-types']?.get?.responses?.['200']?.content?.['application/json']) {
    paths['/booking-types'].get.responses['200'].content['application/json'].example = bookingTypes;
}

// GET /availability
if (paths['/availability']?.get?.responses?.['200']?.content?.['application/json']) {
    paths['/availability'].get.responses['200'].content['application/json'].example = availableSlots;
}

// GET /host/availability
if (paths['/host/availability']?.get?.responses?.['200']?.content?.['application/json']) {
    paths['/host/availability'].get.responses['200'].content['application/json'].example = hostSlots;
}

// GET /host/bookings
if (paths['/host/bookings']?.get?.responses?.['200']?.content?.['application/json']) {
    paths['/host/bookings'].get.responses['200'].content['application/json'].example = bookings;
}

writeFileSync(OPENAPI_PATH, yaml.dump(spec, {indent: 2, lineWidth: 120, noRefs: true}));
console.log('✅ Mock examples injected into', OPENAPI_PATH);
