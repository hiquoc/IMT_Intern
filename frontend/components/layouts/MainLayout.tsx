import Header from "../ui/header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col bg-gray-50">
                {children}
            </div>
        </>
    );
}