import { useRouter } from "next/navigation";
import { Booking } from "@/types";
import Button from "./Button";

interface BookingCardProps {
    booking: Booking;
    roomImage?: string;
}

export default function BookingCard({ booking, roomImage }: BookingCardProps) {
    const router = useRouter();
    return (
            <div className="flex flex-col gap-1 w-full p-4 bg-white/50 bg-blur-md rounded-lg">
                <div className="flex flex-col gap-1 p-4">
                    {roomImage && (
                        <img src={roomImage} alt={booking.resource} className="w-full h-auto rounded-lg" />
                    )}
                    <h1 className="text-lg font-semibold">{booking.resource}</h1>
                    <p className="text-sm text-gray-600">Date: {booking.booking_start.toLocaleDateString()} | Time: {booking.booking_start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-sm text-gray-600">Status: {booking.booking_status}</p>
                    <div className="flex flex-row justify-end mt-2">
                        <Button className="!w-fit !rounded-3xl !text-white !py-2 !px-4 rounded-md !hover:bg-blue-600 !transition-colors" buttonText="View Details" />
                        <Button className="!w-fit !rounded-3xl !text-white !py-2 !px-4 rounded-md !hover:bg-red-600 !transition-colors ml-2" buttonText="Report Fault" onClick={() => {router.push(`/faulty-report/${booking.resource}`)}} />
                    </div>
                </div>
            </div>
    );
}