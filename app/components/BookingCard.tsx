import { useRouter } from "next/navigation";
import { Booking } from "@/types";
import { modifyBookingStatus } from "../actions/BookingController";
import Button from "./Button";

interface BookingCardProps {
    booking: Booking;
    roomImage?: string;
}

export default function BookingCard({ booking, roomImage }: BookingCardProps) {
    const router = useRouter();
    const now = new Date();
    const startDate = new Date(booking.booking_start);

    const fifteenMinutesBeforeStart = new Date(startDate.getTime() - (15 * 6000));
    const canCheckIn = now >= fifteenMinutesBeforeStart && now < startDate && booking.booking_status === "Booked";
    const canReportFault = booking.booking_status === "Check-in";

    const handleCheckIn = async () => {
        await modifyBookingStatus(booking.booking_id, "Check-in");
        router.refresh();
    }


    return (
            <div className="flex flex-col gap-1 w-full p-4 bg-white/50 bg-blur-md rounded-lg">
                <div className="flex flex-col gap-1 p-4">
                    {roomImage && (
                        <img src={roomImage} alt={booking.resource.resource_name} className="w-full h-auto rounded-lg" />
                    )}
                    <h1 className="text-lg font-semibold">{booking.resource.resource_name}</h1>
                    <p className="text-sm text-gray-600">Date: {startDate.toLocaleDateString()} | Time: {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-sm text-gray-600">Status: {booking.booking_status}</p>
                    <div className="flex flex-row justify-end mt-2">
                        <Button className="!w-fit !rounded-3xl rounded-md !hover:bg-blue-600 !transition-colors" buttonText="View Details" onClick={() => {router.push(`/booking_details/${booking.booking_id}?source=bookings`)}}/>
                        {canCheckIn && (
                            <Button className="!w-fit !rounded-3xl rounded-md !hover:bg-green-600 !transition-colors ml-2" buttonText="Check In" onClick={handleCheckIn} />
                        )}
                        {canReportFault && (
                            <Button className="!w-fit !rounded-3xl rounded-md !hover:bg-red-600 !transition-colors ml-2" buttonText="Report Fault" onClick={() => {router.push(`/faulty-report/${booking.resource.resource_id}?source=bookings`)}} />
                        )}
                    </div>
                </div>
            </div>
    );
}