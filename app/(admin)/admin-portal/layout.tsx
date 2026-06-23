export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans">
            {children}
        </div>
    );
}
