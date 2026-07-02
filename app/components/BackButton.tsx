import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

interface BackButtonProp{
    buttonName: string,
    buttonDesc: string,
    onClick?: () => void;
}

export default function BackButton({buttonName, buttonDesc, onClick}: BackButtonProp){

    const router = useRouter();
    const searchParams = useSearchParams();

    const handleBackClick = () => {

        if (onClick) {
            onClick();
            return;
        }

        const source = searchParams.get("source");
        if (source)
            router.push(`/dashboard?tab=${source}`);
        else
            router.back();
    }
    
    return(
        <button onClick={handleBackClick} id="back-btn" className="flex flex-row w-fit h-20 p-4 cursor-pointer">
            <div id="left side" className="w-8 h-10 items-center">
                <p>
                    ←
                </p>
            </div>
            <div id="right-side" className="h-full flex flex-col">
                <div className="h-10 w-full flex items-center justify-start">
                    <p className="font-bold">{buttonName}</p>
                </div>
                <div className="h-10 flex items-center justify-start">
                    <p>{buttonDesc}</p>
                </div>
            </div>
        </button>
    )
}