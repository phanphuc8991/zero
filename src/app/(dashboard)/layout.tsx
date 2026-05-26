export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* sidebar, topbar riêng... */}
      <main>{children}</main>
    </div>
  );
}
