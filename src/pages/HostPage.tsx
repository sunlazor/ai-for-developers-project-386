import {useState} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {api} from '@/api/client'
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {toast} from '@/components/ui/use-toast'
import {formatTime, formatDate} from '@/lib/utils'

export function HostPage() {
    const [token, setToken] = useState('')
    const [isAuthed, setIsAuthed] = useState(false)
    const queryClient = useQueryClient()

    const bookingTypes = useQuery({
        queryKey: ['host-bookingTypes'],
        queryFn: () => api.listBookingTypes(),
    })

    const hostSlots = useQuery({
        queryKey: ['host-availability', token],
        queryFn: () => api.getHostAvailability(token),
        enabled: isAuthed,
    })

    const bookings = useQuery({
        queryKey: ['host-bookings', token],
        queryFn: () => api.listBookings(token),
        enabled: isAuthed,
    })

    const createBt = useMutation({
        mutationFn: () => api.createBookingType(
            {slug: 'quick', title: 'Quick Chat', description: 'A quick 15-min chat', durationSlots: 1},
            token
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['host-bookingTypes']})
            toast({title: 'Created'})
        },
    })

    const cancelBooking = useMutation({
        mutationFn: (id: string) => api.cancelBooking(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['host-bookings']})
            toast({title: 'Cancelled'})
        },
    })

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <section>
                <h1 className="text-3xl font-bold mb-4">Host Dashboard</h1>
                {!isAuthed ? (
                    <div className="flex gap-2 max-w-sm">
                        <Input
                            placeholder="Bearer token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                        <Button onClick={() => setIsAuthed(true)}>Login</Button>
                    </div>
                ) : (
                    <Button variant="outline" onClick={() => {
                        setIsAuthed(false);
                        setToken('')
                    }}>
                        Logout
                    </Button>
                )}
            </section>

            {isAuthed && (
                <>
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Booking Types</h2>
                            <Button onClick={() => createBt.mutate()} size="sm">
                                Add Quick Chat
                            </Button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {bookingTypes.data?.map((bt) => (
                                <Card key={bt.slug}>
                                    <CardHeader>
                                        <CardTitle>{bt.title}</CardTitle>
                                        <CardDescription>{bt.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {bt.durationSlots * 15} min &middot; {bt.active ? 'Active' : 'Inactive'}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">
                            Availability ({hostSlots.data?.filter(s => s.state === 'available').length ?? 0} open)
                        </h2>
                        {hostSlots.data && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                {hostSlots.data.slice(0, 48).map((slot) => (
                                    <div
                                        key={slot.start}
                                        className={`p-2 rounded text-xs border ${
                                            slot.state === 'booked'
                                                ? 'bg-destructive/10 border-destructive/30'
                                                : slot.state === 'available'
                                                    ? 'bg-primary/10 border-primary/30'
                                                    : 'bg-muted border-muted'
                                        }`}
                                    >
                                        <div>{formatDate(new Date(slot.start))}</div>
                                        <div>{formatTime(new Date(slot.start))}</div>
                                        <div className="capitalize">{slot.state}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
                        {bookings.data?.length === 0 && (
                            <p className="text-muted-foreground">No bookings yet.</p>
                        )}
                        <div className="space-y-3">
                            {bookings.data?.map((booking) => (
                                <Card key={booking.id}>
                                    <CardContent className="flex items-center justify-between py-4">
                                        <div>
                                            <p className="font-medium">{booking.visitorName}</p>
                                            <p className="text-sm text-muted-foreground">{booking.visitorEmail}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(new Date(booking.startSlot))} at{' '}
                                                {formatTime(new Date(booking.startSlot))}
                                            </p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => cancelBooking.mutate(booking.id)}
                                        >
                                            Cancel
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    )
}