import { useState } from "react";
import { FilterButtons } from "./FilterButtons";
import Button from "./Button";

export function MaintenanceRequestList(){
    const [selectedDept, setSelectedDept] = useState("All");

    return(
        <div>
            <FilterButtons onClickHandler={setSelectedDept}/>
        </div>
    )
}