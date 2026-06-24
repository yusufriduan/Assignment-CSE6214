import BackButton from "./BackButton";
import { Booking } from "@/types";

interface VenueBookingProps {
    setActiveSection: (section: string) => void;
}

export default function VenueBooking({ setActiveSection }: VenueBookingProps) {
    const mockBooking = {
        booking_id: "1",
        booking_author: "John Doe",
        booking_start: new Date("2023-10-10T10:00:00"),
        booking_end: new Date("2023-10-10T12:00:00")
    } as Booking;

    const formatDateTime = (date: Date) => {
        return date.toLocaleString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });
    };

    return (
        <div className="p-6 text-lg gap-2 w-full h-full max-w-lg mx-auto flex flex-col">
            <header className="flex flex-col items-start gap-1">
                <BackButton buttonName={`Booking for ${mockBooking.booking_author}`} buttonDesc={`${formatDateTime(mockBooking.booking_start)} to ${formatDateTime(mockBooking.booking_end)}`} />
            </header>
            <div className="w-full h- flex flex-col gap-4 mt-6">
            </div>
        </div>
    );
}