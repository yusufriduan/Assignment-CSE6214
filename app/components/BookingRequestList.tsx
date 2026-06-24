import { FilterButtons } from "./FilterButtons";
import { useState } from "react";
import BookingCard from "./BookingCard";
import BookingRequestCard from "./BookingRequestCard";

export function BookingRequestList(){

    const [selectedDept, setSelectedDept] = useState("All");

    return(
        <div className="w-full min-h-full">
            <FilterButtons onClickHandler={setSelectedDept}/>
            <div className="w-full overflow-hidden flex justify-center flex-col items-center">
                <BookingRequestCard hidden={selectedDept !== "All" && selectedDept !== "FCI"} userName="Shawn Huang Qi Yang" userRole="Campus Staff" resourceDepartment="FCI" resourceName="CQAR1002"/>
                <BookingRequestCard hidden={selectedDept !== "All" && selectedDept !== "FAIE"} userName="Yusuf Riduan" userRole="Student" resourceDepartment="FAIE" resourceName="CLCR2045"/>
            </div>
        </div>
    )
}