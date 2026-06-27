import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    buttonText?: ReactNode;
}

export default function Button({ buttonText, className, ...props }: ButtonProps) {
    return (
        <button 
            className={`flex items-center justify-center 
                bg-white/20 backdrop-blur-lg border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.1)] cursor-pointer rounded-3xl font-semibold text-sm
                bg-gradient-to-tr from-white/5 via-white/20 to-white/5
                text-black px-4 py-2
                transition-all ease-in-out duration-300 hover:bg-white/30 hover:scale-105 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-white/60 active:scale-95
                ${className}`}
            {...props}
        >
            {buttonText}
        </button>
    );
}