import { useState, useEffect } from "react";
import Button from "./Button";
import Input from "./input";
import { fetchUser } from "../actions/UserController";

interface PreBookingProps{
    setActiveSection: (section: string) => void;
    setBookingData: (data: {
        userId: string;
        fullName: string;
        email: string;
        bookingStart: Date;
        bookingEnd: Date;
        bookingPurpose: string;
    }) => void;
}

export default function preBooking({ setActiveSection, setBookingData }: PreBookingProps) {
    const [UserID, setUserID] = useState("");
    const [FullName, setFullName] = useState("");
    const [Email, setEmail] = useState("");
    const [bookingStart, setBookingStart] = useState("");
    const [bookingEnd, setBookingEnd] = useState("");
    const [bookingPurpose, setBookingPurpose] = useState("");

    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!UserID.trim()) {
            setFullName("");
            setEmail("");
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            const userData = await fetchUser(UserID);
            if (userData) {
                setFullName(userData.name);
                setEmail(userData.email);
            } else {
                setFullName("");
                setEmail("");
            }
            setIsSearching(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [UserID]);

    const handleBookingStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = e.target.value;
        setBookingStart(newStart);

        // If the end date is now before the new start date, reset it.
        if (bookingEnd && new Date(newStart) > new Date(bookingEnd)) {
            setBookingEnd('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!FullName) {
            alert("Please wait for user details to load or enter a valid User ID.");
            return;
        }
        // Add validation for end date > start date
        if (new Date(bookingEnd) <= new Date(bookingStart)) {
            alert("End booking date and time must be after the start date and time.");
            return;
        }

        if (!bookingStart || !bookingEnd || !bookingPurpose) {
            alert("Please fill in all booking details.");
            return;
        }

        setBookingData({
            userId: UserID,
            fullName: FullName,
            email: Email,
            bookingStart: new Date(bookingStart),
            bookingEnd: new Date(bookingEnd),
            bookingPurpose: bookingPurpose,
        });
        setActiveSection('venue-booking');
    };

    // Get the current date and time in the format required by datetime-local input's min attribute
    const now = new Date();
    const minDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

    return (
        <div className="p-6 text-lg gap-2 w-full h-full max-w-lg mx-auto flex flex-col">
            <header className="flex flex-col items-start gap-1">
                    <h1 className="text-2xl font-bold">Ready to Book!</h1>
                    <p className="text-sm text-gray-600">Verify your details first.</p>
            </header>
            <form className="mt-6 flex flex-col items-center gap-8" onSubmit={handleSubmit} noValidate>
                <Input name="user-id" label="Staff ID" type="text" placeholder="Student ID" value={UserID} onChange={(e) => setUserID(e.target.value)} required />
                <Input name="full-name" label="Full Name" type="text" placeholder="Full Name" value={FullName} disabled />
                <Input name="email" label="Staff Email" type="text" placeholder="Student Email" value={Email} disabled />
                <Input 
                    name="start-booking" 
                    label="Booking Date" 
                    type="datetime-local" 
                    placeholder="Booking Date" 
                    value={bookingStart} 
                    onChange={handleBookingStartChange} 
                    min={minDateTime}
                    required />
                <Input 
                    name="end-booking" 
                    label="End Booking Date" 
                    type="datetime-local" 
                    placeholder="End Booking Date" 
                    value={bookingEnd} onChange={e => setBookingEnd(e.target.value)} 
                    min={bookingStart || minDateTime}
                    disabled={!bookingStart}
                    required />
                <Input name="booking-purpose" label="Booking Purpose" type="text" placeholder="Booking Purpose" value={bookingPurpose} onChange={e => setBookingPurpose(e.target.value)} required />
                <Button type="submit" className="!w-fit !rounded-3xl !py-3 !px-5 rounded-md !hover:bg-blue-600 !transition-colors" buttonText="+   Add Room" />
            </form>
        </div>
    );
}