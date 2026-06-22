import Link from "next/link"
import { redirect } from 'next/navigation';

interface BackButtonProp{
    buttonName: string,
    buttonDesc: string,
}

export default function BackButton({buttonName, buttonDesc}: BackButtonProp){

    // const prevPage = history.state.from;
    // if(prevPage === undefined || prevPage === null){
    //     redirect('/');
    // }

    return(
        <Link href={'/'} id="back-btn" className="absolute top-0 left-0 flex flex-row w-fit h-20 p-4">
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
        </Link>
    )
}