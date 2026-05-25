export default function Button({color="blue",children,onClick,disabled=false}: {color?: 'blue' | 'green' | 'red', children: React.ReactNode, onClick?: () => void, disabled?: boolean}) {
    const colorClasses = {
        blue: 'bg-blue-500 hover:bg-blue-600 text-white',
        green: 'bg-green-500 hover:bg-green-600 text-white',
        red: 'bg-red-500 hover:bg-red-600 text-white',
    };
    return (
        <button className={`px-4 py-2 rounded-md ${colorClasses[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}