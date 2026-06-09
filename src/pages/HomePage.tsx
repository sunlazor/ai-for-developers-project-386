import {useQuery} from '@tanstack/react-query'
import {useNavigate, Link} from 'react-router-dom'
import {api} from '@/api/client'
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Clock, Calendar} from 'lucide-react'
import {Dialog, DialogTrigger} from '@/components/ui/dialog'
import {BookingTypeSelector} from '@/components/BookingTypeSelector'

export function HomePage() {
    const navigate = useNavigate()
    const {data: bookingTypes, isLoading} = useQuery({
        queryKey: ['bookingTypes'],
        queryFn: api.listBookingTypes,
    })

    const {data: slots} = useQuery({
        queryKey: ['availability'],
        queryFn: api.getAvailability,
    })

    const handleBookNow = (slug: string) => {
        navigate(`/book/${slug}`)
    }

    return (
        <div className="space-y-8">
            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Book time with us</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Choose a meeting type and pick an available slot that works for you.
                </p>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="lg" className="w-full sm:w-auto">
                            <Calendar className="h-4 w-4 mr-2"/>
                            Book Now
                        </Button>
                    </DialogTrigger>
                    <BookingTypeSelector
                        bookingTypes={bookingTypes ?? []}
                        onSelect={handleBookNow}
                        onClose={() => {
                        }}
                    />
                </Dialog>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Meeting Types</h2>
                {isLoading ? (
                    <p className="text-muted-foreground">Loading...</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {bookingTypes?.map((bt) => (
                            <Card key={bt.slug}>
                                <CardHeader>
                                    <CardTitle>{bt.title}</CardTitle>
                                    <CardDescription>{bt.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4"/>
                                        <span>{bt.durationSlots * 15} minutes</span>
                                    </div>
                                    <Button className="w-full" asChild>
                                        <Link to={`/book/${bt.slug}`}>
                                            <Calendar className="h-4 w-4 mr-2"/>
                                            Book
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                        {bookingTypes?.length === 0 && (
                            <p className="text-muted-foreground col-span-full text-center py-8">
                                No meeting types available right now.
                            </p>
                        )}
                    </div>
                )}
            </section>

            {slots && slots.length > 0 && (
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Available This Week</h2>
                    <p className="text-muted-foreground">
                        {slots.length} slot{slots.length !== 1 && 's'} open for booking.
                    </p>
                </section>
            )}
        </div>
    )
}