import { TooltipProvider } from "@/components/ui/tooltip";
import "@/app/(dashboard)/dashboard.css";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "sonner";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // data-theme="dark"
      className={`h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <TooltipProvider>
        <body className="min-h-full font-sans">
          <AuthProvider>
            <main>{children}</main>
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </body>
      </TooltipProvider>
    </html>
  );
}
