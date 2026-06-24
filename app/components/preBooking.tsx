import Button from "./Button";
import Input from "./input";

interface PreBookingProps{
    setActiveSection: (section: string) => void;
}

export default function preBooking({ setActiveSection }: PreBookingProps) {
    return (
        <div className="p-6 text-lg gap-2 w-full h-full max-w-lg mx-auto flex flex-col">
            <header className="flex flex-col items-start gap-1">
                    <h1 className="text-2xl font-bold">Ready to Book!</h1>
                    <p className="text-sm text-gray-600">Verify your details first.</p>
            </header>
            <form className="mt-6 flex flex-col items-center gap-8">
                <Input key="student-id" label="Student ID" type="text" placeholder="Student ID" required />
                <Input key="full-name" label="Full Name" type="text" placeholder="Full Name" disabled />
                <Input key="student-email" label="Student Email" type="text" placeholder="Student Email" disabled />
                <Input key="start-booking-date" label="Booking Date" type="datetime-local" placeholder="Booking Date" required />
                <Input key="end-booking-date" label="End Booking Date" type="datetime-local" placeholder="End Booking Date" required />
                <Input key="booking-purpose" label="Booking Purpose" type="text" placeholder="Booking Purpose" required />
                <Button type="submit" className="!w-fit !rounded-3xl !text-white !py-3 !px-5 rounded-md !hover:bg-blue-600 !transition-colors" buttonText="+   Add Room" onClick={() => setActiveSection('venue-booking')} />
            </form>
        </div>
    );
}