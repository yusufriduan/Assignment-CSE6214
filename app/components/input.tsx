interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    type: string;
    placeholder: string;
}

export default function Input({ label, type, placeholder, id,  ...props }: InputProps) {
    const safeId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor={safeId} className="text-sm font-bold text-black">{label}</label>
            <input
                id={safeId}
                type={type}
                placeholder={placeholder}
                className="w-full text-sm p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                {...props}
            />
        </div>
    )
}