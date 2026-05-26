import "@/app/dashboard.css";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen font-sans">
      {/* sidebar, topbar riêng... */}
      <main>{children}</main>
    </div>
  );
}
