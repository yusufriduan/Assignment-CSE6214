import { useState, useEffect } from "react";
import Button from "./Button";
import Input from "./input";
import { fetchUserForAutofill } from "@/app/actions/userActions";

interface PreBookingProps{
    setActiveSection: (section: string) => void;
}

export default function preBooking({ setActiveSection }: PreBookingProps) {
    const [UserID, setUserID] = useState("");
    const [FullName, setFullName] = useState("");
    const [Email, setEmail] = useState("");

    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!UserID.trim()) {
            setFullName("");
            setEmail("");
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            const userData = await fetchUserForAutofill(UserID);
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

    return (
        <div className="p-6 text-lg gap-2 w-full h-full max-w-lg mx-auto flex flex-col">
            <header className="flex flex-col items-start gap-1">
                    <h1 className="text-2xl font-bold">Ready to Book!</h1>
                    <p className="text-sm text-gray-600">Verify your details first.</p>
            </header>
            <form className="mt-6 flex flex-col items-center gap-8">
                <Input key="user-id" label="Student ID" type="text" placeholder="Student ID" value={UserID} onChange={(e) => setUserID(e.target.value)} required />
                <Input key="full-name" label="Full Name" type="text" placeholder="Full Name" value={FullName} disabled />
                <Input key="email" label="Student Email" type="text" placeholder="Student Email" value={Email} disabled />
                <Input key="start-booking" label="Booking Date" type="datetime-local" placeholder="Booking Date" required />
                <Input key="end-booking" label="End Booking Date" type="datetime-local" placeholder="End Booking Date" required />
                <Input key="booking-purpose" label="Booking Purpose" type="text" placeholder="Booking Purpose" required />
                <Button type="submit" className="!w-fit !rounded-3xl !py-3 !px-5 rounded-md !hover:bg-blue-600 !transition-colors" buttonText="+   Add Room" onClick={() => setActiveSection('venue-booking')} />
            </form>
        </div>
    );
}