import { IconType } from "react-icons";

export interface NavItem {
    id: string;
    label: string;
    icon: IconType;
}

interface NavBarProps {
    items: NavItem[];
    activeSection: string;
    onSectionChange: (id: string) => void;
}

export default function NavBar({ items, activeSection, onSectionChange }: NavBarProps) {
    return (
        <div className="w-fit bg-[#D9D9D9] rounded-4xl pr-4 pl-4 pt-2 pb-2 flex flex-row justify-center gap-4 z-100">
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`flex flex-col items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors duration-200 ${activeSection === item.id ? "bg-[#C0C0C0] shadow-md2" : "hover:bg-[#C0C0C0]/50"}`}
                    onClick={() => onSectionChange(item.id)}
                >
                    <item.icon size={20} />
                    <span className="text-sm font-medium">{item.label}</span>
                </div>
            ))}
        </div>
    )
}