import { DEPARTMENTS } from "../constants";
import { useState } from "react";
import ScrollContainer from 'react-indiana-drag-scroll';

interface FilterButtonProp{
    onClickHandler: (val: string) => void;
}

export function FilterButtons({onClickHandler}: FilterButtonProp){

    const [selectedKey, setSelectedKey] = useState<string | null>("all");

    return(
        <ScrollContainer className="flex flex-row gap-2 overflow-x-auto select-none scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <button key="all" onClick={() => {setSelectedKey("all"); onClickHandler("All")}} className={`min-w-16 h-8 border-2 rounded-full font-semibold cursor-pointer ${selectedKey === "all" ? "bg-secondary" : "bg-white"}`}>
                All
            </button>
            {
                [...DEPARTMENTS.entries()].map(([key, value]) => (
                    <button key={key} onClick={() => {setSelectedKey(key); onClickHandler(key)}} className={`min-w-16 h-8 border-2 rounded-full font-semibold cursor-pointer ${selectedKey === key ? "bg-secondary" : "bg-white"}`}>
                        {key}
                    </button>
                ))
            }
        </ScrollContainer>
    )
}