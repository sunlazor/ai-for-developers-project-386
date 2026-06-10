<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\Booking;
use App\Entity\BookingType;
use App\Entity\Slot;
use App\Entity\SlotState;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

/**
 * Seed the database with data matching the openapi.yaml examples.
 *
 * All times are UTC. Slots align to :00/:15/:30/:45 boundaries.
 * Horizon: Host = current week + 4, Visitor = current week + 2 (ADR-0001).
 */
class AppFixtures extends Fixture
{
    /** @var array<string, Slot> Slots keyed by start ISO string */
    private array $slotMap = [];

    public function load(ObjectManager $manager): void
    {
        $this->seedBookingTypes($manager);
        $this->seedSlots($manager);
        $this->seedBookings($manager);

        $manager->flush();
    }

    private function seedBookingTypes(ObjectManager $manager): void
    {
        $types = [
            ['intro-call', 'Intro Call', 'A quick 30-minute introductory call to discuss your needs.', 2, true],
            ['deep-dive', 'Deep Dive Session', 'A 60-minute deep dive into your project requirements.', 4, true],
            ['quick-chat', 'Quick Chat', 'A brief 15-minute chat for quick questions.', 1, true],
            ['workshop', 'Workshop', 'A 90-minute hands-on workshop session.', 6, false],
        ];

        foreach ($types as [$slug, $title, $desc, $dur, $active]) {
            $bt = new BookingType($slug, $title, $desc, $dur, $active);
            $manager->persist($bt);
        }
    }

    private function seedSlots(ObjectManager $manager): void
    {
        $utc = new \DateTimeZone('UTC');

        // Generate slots across the Host horizon: current week + 4 weeks (ADR-0001).
        $now = new \DateTimeImmutable('now', $utc);
        $day = (int)$now->format('w'); // 0=Sun, 1=Mon
        $diff = $day === 0 ? -6 : 1 - $day;
        $monday = $now->modify("{$diff} days")->setTime(0, 0, 0, 0);

        // Host horizon: 5 full weeks (current week + 4)
        $horizonEnd = $monday->modify('+35 days')->modify('-1 second');

        // Generate every 15-minute slot in the horizon as unavailable.
        $cursor = $monday;
        while ($cursor <= $horizonEnd) {
            $slot = new Slot($cursor, SlotState::Unavailable);
            $manager->persist($slot);
            $this->slotMap[$cursor->format('Y-m-d\TH:i:s')] = $slot;
            $cursor = $cursor->modify('+15 minutes');
        }

        // Open specific slots as `available` (matching the openapi.yaml examples).
        $availableStarts = [
            '2026-06-08T09:00:00',
            '2026-06-08T09:15:00',
            '2026-06-08T09:30:00',
            '2026-06-08T09:45:00',
            '2026-06-08T10:15:00',
            '2026-06-09T14:00:00',
            '2026-06-09T14:15:00',
            '2026-06-09T15:00:00',
            '2026-06-09T15:15:00',
            '2026-06-09T15:30:00',
            '2026-06-09T15:45:00',
            '2026-06-10T10:00:00',
            '2026-06-10T10:15:00',
            '2026-06-10T10:30:00',
            '2026-06-10T10:45:00',
            '2026-06-11T13:00:00',
            '2026-06-11T14:00:00',
            '2026-06-11T14:15:00',
            '2026-06-11T14:30:00',
            '2026-06-11T14:45:00',
            '2026-06-15T09:00:00',
            '2026-06-15T09:15:00',
            '2026-06-15T09:30:00',
            '2026-06-15T09:45:00',
            '2026-06-16T09:00:00',
            '2026-06-16T09:15:00',
            '2026-06-16T09:30:00',
            '2026-06-16T10:00:00',
            '2026-06-17T14:00:00',
            '2026-06-17T14:15:00',
            '2026-06-17T14:30:00',
            '2026-06-17T14:45:00',
        ];

        foreach ($availableStarts as $ts) {
            if (isset($this->slotMap[$ts])) {
                $this->slotMap[$ts]->setState(SlotState::Available);
            }
        }

        // Mark booked slots (occupied by the two seed Bookings).
        $bookedStarts = [
            '2026-06-09T10:30:00',
            '2026-06-09T10:45:00',
            '2026-06-12T14:00:00',
            '2026-06-12T14:15:00',
            '2026-06-12T14:30:00',
            '2026-06-12T14:45:00',
        ];

        foreach ($bookedStarts as $ts) {
            if (isset($this->slotMap[$ts])) {
                $this->slotMap[$ts]->setState(SlotState::Booked);
            }
        }
    }

    private function seedBookings(ObjectManager $manager): void
    {
        $utc = new \DateTimeZone('UTC');

        $bookings = [
            [
                '2026-06-09-10-30',
                'intro-call',
                new \DateTimeImmutable('2026-06-09T10:30:00', $utc),
                'Alice Johnson',
                'alice@example.com',
            ],
            [
                '2026-06-12-14-00',
                'deep-dive',
                new \DateTimeImmutable('2026-06-12T14:00:00', $utc),
                'Bob Smith',
                'bob@example.com',
            ],
        ];

        foreach ($bookings as [$id, $slug, $start, $name, $email]) {
            $booking = new Booking($id, $slug, $start, $name, $email);
            $manager->persist($booking);
        }
    }
}
